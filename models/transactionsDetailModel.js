const mongoose = require('mongoose');

const transactionsDetailSchema = new mongoose.Schema({
  _id: String,
  amount: String,
  point: String,
  from: String,
  to: String,
  dateTime: Date,
});

const TransactionsDetailModel = mongoose.model('TransactionsDetail', transactionsDetailSchema);

module.exports = TransactionsDetailModel;
