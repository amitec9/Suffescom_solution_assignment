// Author: Amit Kumar
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
   email: {
      type: String,
      required: true,
      unique: true,   // uniqueness constraint
      lowercase: true,
      trim: true,
      index: true     // 🔥 creates index on email
    },
  password: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' }
}, { timestamps: true });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
