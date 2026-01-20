// Author: Amit Kumar
const Wallet = require('../models/Wallet');

const getWalletByUser = async (userId) => {
  return Wallet.findOne({ userId });
};

const updateBalanceAtomic = async (userId, amount, session) => {
  const wallet = Wallet.findOneAndUpdate(
      { userId, balance: { $gte: amount } },
     {$inc: {
        balance: -amount,
        version: 1
            }},
      { new: true, session }
    );
    return wallet;
};

module.exports = { getWalletByUser, updateBalanceAtomic };
