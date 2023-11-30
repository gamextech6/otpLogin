const express = require('express');
const { 
    addDepositTransaction, 
    getDailyDepositTransactions, 
    getMonthlyDepositTransactions, 
    getYearlyDepositTransactions,
    getDailyDepositTransactionsByBankAccountNumber
 } = require('../controller/transactionController');

const router = express.Router();

// Use more specific paths to avoid conflicts
router.post('/daily', addDepositTransaction);
router.get('/daily', getDailyDepositTransactions);
router.get('/dailyByBankAccount', getDailyDepositTransactionsByBankAccountNumber);
router.get('/monthly/:month/:year', getMonthlyDepositTransactions);
router.get('/yearly/:year', getYearlyDepositTransactions);

module.exports = router;
