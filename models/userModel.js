const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: String,
  // phoneNumber: {
  //   type: String,
  //   unique: true,
  // },
  userName: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  phoneNumber: String,
  firstName: String,
  lastName: String,
  gender: String,
  dob: String,
  role: {
    type: String,
    enum: ["admin", "agent", "user"],
    default: "user",
  },
  referral: {
    type: String,
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
  blocked: {
    type: Boolean,
    default: false,
  }, 
  agentBlocked: {
    type: Boolean,
    default: false,
  },
  bankName : String,
  branchName : String,
  accountHolderName: String, 
  bankAccountNumber: {
    type: String,
    unique: true,
  },
  ifscCode: String,
  aadhar: String,
  pan: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
