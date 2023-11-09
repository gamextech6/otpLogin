const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  bankHolder: String,
  account_No: String,
  ifsc_code: String,
  present_amount: String,
  qrcode: String,
});

const BankDetailsModel = mongoose.model('BankDetails', bankDetailsSchema);

module.exports = BankDetailsModel;
