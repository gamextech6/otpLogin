const mongoose = require('mongoose');

const agentPointSchema = new mongoose.Schema({
  phoneNumber: String,
  playPoint: String,
  winPoint: String,
  referrerPoint: String,
  addPoint: String,
  withdrawalAmount: String,
  dateTime: Date,
});

const AgentPointModel = mongoose.model('AgentPoint', agentPointSchema);

module.exports = AgentPointModel;
