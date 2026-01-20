const mongoose = require('mongoose');
require('dotenv').config();
let url =process.env.MONGO_URI;
const connectDB = async () => {
  try {
    
    await mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error ❌', err);
    process.exit(1);
  }
};

module.exports = connectDB;
