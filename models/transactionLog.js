// Author: Amit Kumar
const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['WITHDRAW'] },
  refId: { type: mongoose.Schema.Types.ObjectId },
  beforeBalance: { type: mongoose.Schema.Types.Decimal128 },
  afterBalance: { type: mongoose.Schema.Types.Decimal128 },
  status: { type: String, enum: ['PENDING','SUCCESS','FAILED'] }
}, { timestamps: true });

module.exports = mongoose.model('TransactionLog', transactionLogSchema);
