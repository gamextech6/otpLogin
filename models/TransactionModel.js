const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: String,
        role: 'user',
        required: true,
    },
    admin: {
        type: String,
        role: 'admin',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    actionType: {
        type: String,
        enum: ['add', 'deduct'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
