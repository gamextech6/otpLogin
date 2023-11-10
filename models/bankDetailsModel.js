const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  branchName: String,
	bankName: String,
  bankHolder: String,
  account_No: String,
  ifsc_code: String,
  present_amount: String,
  qrcode: String,
});

const BankDetailsModel = mongoose.model('BankDetails', bankDetailsSchema);

module.exports = BankDetailsModel;
