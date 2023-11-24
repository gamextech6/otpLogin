const mongoose = require('mongoose');

const adminBankModelSchema = new mongoose.Schema({
  bankName : String,
  branchName : String,
  accountHolderName: String, 
  bankAccountNumber: {
    type: String,
    unique: true,
  },
  ifscCode: String,
  qr : String,
});

const adminBankModel = mongoose.model('adminBank', adminBankModelSchema);

module.exports = adminBankModel;