// Author: Amit Kumar
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  withdrawal_amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['PENDING','PROCESSING','SUCCESS','FAILED'], default: 'PENDING' },
  idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true // 🔥 critical for idempotency
    }
  },
 { timestamps: true });
withdrawalSchema.index({ idempotencyKey: 1 }, { unique: true });
module.exports = mongoose.model('Withdrawal', withdrawalSchema);
