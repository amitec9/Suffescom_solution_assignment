// Author: Amit Kumar
// Description: Withdrawal service with MongoDB transaction + idempotency + async queue
const mongoose = require('mongoose');
const Withdrawal = require('../models/Withdrawal');
const TransactionLog = require('../models/TransactionLog');
const withdrawalQueue = require('../config/queue');
const { updateBalanceAtomic } = require('../repositories/wallet.repository');

/**
 * Initiates a withdrawal request
 * - Ensures idempotency
 * - Deducts wallet balance atomically
 * - Creates withdrawal & transaction log
 * - Pushes job to Bull queue for async processing
 */
const initiateWithdrawal = async (userId, withdrawal_amount, destination, idempotencyKey) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check idempotency
    const existing = await Withdrawal.findOne({ idempotencyKey }).session(session);
    if (existing) return existing;

    
    // Atomic wallet update
const wallet = await updateBalanceAtomic(
  userId,
  withdrawal_amount,
  session
);

if (!wallet) {
  throw new Error('Insufficient balance');
}

    // Create withdrawal
    const withdrawal = await Withdrawal.create([{
      userId,
      withdrawal_amount,
      destination,
      status: 'PENDING',
      idempotencyKey
    }], { session });

    const afterBalance = Number(wallet.balance);
const beforeBalance = afterBalance + Number(withdrawal_amount);
    // Create transaction log
    await TransactionLog.create([{
      userId,
      type: 'WITHDRAW',
      refId: withdrawal[0]._id,
      beforeBalance: beforeBalance,
      afterBalance: afterBalance,
      status: 'PENDING'
    }], { session });

    await session.commitTransaction();
    session.endSession();
    await withdrawalQueue.add({ withdrawalId: withdrawal[0]._id });
    return withdrawal[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

module.exports = { initiateWithdrawal };
