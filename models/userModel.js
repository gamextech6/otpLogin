const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  userName: { 
    type: String, 
    unique: true },
  password: { 
    type: String },
  role: {
    type: String,
    enum: ["admin", "agent", "user"],
    default: "user",
  },
  balance: {
    type: Number,
    default: 0,
  },
  point: Number,
  ip: String,
  os: String,
  referrerCode: {
    type: String,
    unique: true,
  },
  referredCode: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
