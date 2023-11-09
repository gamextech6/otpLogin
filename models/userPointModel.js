const mongoose = require('mongoose');

const userPointSchema = new mongoose.Schema({
  phoneNumber: String,
  playPoint: Number,
  winPoint: Number,
  referrerPoint: Number,
  addPoint: Number,
  withdrawalPoint: Number,
  dateTime: Date,
});

const UserPointModel = mongoose.model('UserPoint', userPointSchema);

module.exports = UserPointModel;
