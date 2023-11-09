const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  currency: String,
  payment_method: String,
  confirmation_method: String,
  amount: String,
  confirm: Boolean,
});

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;
