// Author: Amit Kumar
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one wallet per user
      index: true   // 🔥 fast lookup
    },
  balance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  version: { type: Number, default: 0 }
}, { timestamps: true });
walletSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', walletSchema);
