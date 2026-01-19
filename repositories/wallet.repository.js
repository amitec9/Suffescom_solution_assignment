// Author: Amit Kumar
const Wallet = require('../models/Wallet');

const getWalletByUser = async (userId) => {
  return Wallet.findOne({ userId });
};

const updateBalanceAtomic = async (userId, amount, session) => {
  return Wallet.findOneAndUpdate(
    { userId, balance: { $gte: amount } },
    { $inc: { balance: -amount }, $inc: { version: 1 } },
    { new: true, session }
  );
};

module.exports = { getWalletByUser, updateBalanceAtomic };
