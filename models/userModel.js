const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum : ["admin", "agent" , "user"],
    default: "user",
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
