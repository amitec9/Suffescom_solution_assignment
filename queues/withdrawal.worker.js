// Author: Amit Kumar
const Withdrawal = require('../models/Withdrawal');
const TransactionLog = require('../models/TransactionLog');

module.exports = async (job) => {
  const { withdrawalId } = job.data;

  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal || withdrawal.status !== 'PENDING') {
    throw new Error('Invalid withdrawal');
  }

  try {
    // Simulate external payment processing
    await new Promise(res => setTimeout(res, 2000)); // 2 sec delay

    withdrawal.status = 'SUCCESS';
    await withdrawal.save();

    // Update transaction log
    await TransactionLog.findOneAndUpdate(
      { refId: withdrawal._id },
      { status: 'SUCCESS' }
    );

    return withdrawal;
  } catch (err) {
    withdrawal.status = 'FAILED';
    await withdrawal.save();

    await TransactionLog.findOneAndUpdate(
      { refId: withdrawal._id },
      { status: 'FAILED' }
    );

    throw err;
  }
};
