const mongoose = require('mongoose');
require('dotenv').config();
let url ="mongodb+srv://amitwebappmate:0Se8d8R2tmJ95a0J@cluster0.lj3fcrs.mongodb.net/payment"|| process.env.MONGO_URI;
const connectDB = async () => {
  try {
    
    await mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB connection error ❌', err);
    process.exit(1);
  }
};

module.exports = connectDB;
