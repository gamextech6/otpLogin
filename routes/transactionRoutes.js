const express = require('express');
const { 
    addDepositTransaction, 
    getDailyDepositTransactions, 
    getMonthlyDepositTransactions, 
    getYearlyDepositTransactions,
    getDailyDepositTransactionsByBankAccountNumber,
    addWithdrawlTransaction, 
    getDailyWithdrawlTransactions, 
    getMonthlyWithdrawlTransactions, 
    getYearlyWithdrawlTransactions,
    getDailyWithdrawlTransactionsByBankAccountNumber
 } = require('../controller/transactionController');

const router = express.Router();

// Use more specific paths to avoid conflicts
router.post('/dailydeposit', addDepositTransaction);
router.get('/dailydeposit', getDailyDepositTransactions);
router.get('/dailydepositbybankaccount', getDailyDepositTransactionsByBankAccountNumber);
router.get('/monthlydeposit', getMonthlyDepositTransactions);
router.get('/yearlydeposit', getYearlyDepositTransactions);
router.post('/dailywithdrawl', addWithdrawlTransaction);
router.get('/dailywithdrawl', getDailyWithdrawlTransactions);
router.get('/dailywithdrawlByBankAccount', getDailyWithdrawlTransactionsByBankAccountNumber);
router.get('/monthlywithdrawl', getMonthlyWithdrawlTransactions);
router.get('/yearlywithdrawl', getYearlyWithdrawlTransactions);

module.exports = router;
