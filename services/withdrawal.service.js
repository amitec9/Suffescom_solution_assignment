// Author: Amit Kumar
const mongoose = require('mongoose');
const Withdrawal = require('../models/Withdrawal');
const Wallet = require('../models/Wallet');
const TransactionLog = require('../models/TransactionLog');
const withdrawalQueue = require('../config/queue');

const initiateWithdrawal = async (userId, withdrawal_amount, destination, idempotencyKey) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check idempotency
    const existing = await Withdrawal.findOne({ idempotencyKey }).session(session);
    if (existing) return existing;

    // Atomic balance deduction
    const wallet = await Wallet.findOneAndUpdate(
      { userId, balance: { $gte: withdrawal_amount } },
     {$inc: {
        balance: -withdrawal_amount,
        version: 1
            }},
      { new: true, session }
    );

    if (!wallet) throw new Error('Insufficient balance');

    // Create withdrawal
    const withdrawal = await Withdrawal.create([{
      userId,
      withdrawal_amount,
      destination,
      status: 'PENDING',
      idempotencyKey
    }], { session });

    // Create transaction log
    await TransactionLog.create([{
      userId,
      type: 'WITHDRAW',
      refId: withdrawal[0]._id,
      beforeBalance: wallet.balance + withdrawal_amount,
      afterBalance: wallet.balance,
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
