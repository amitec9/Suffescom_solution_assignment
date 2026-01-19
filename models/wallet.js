// Author: Amit Kumar
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  balance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  version: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
