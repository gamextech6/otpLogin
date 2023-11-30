const DepositTransactionModel = require("../models/depositTransactionModel");
const WithdrawlTransactionModel = require("../models/WithdrawlTransactionModel");

exports.addDepositTransaction = async (req, res) => {
  try {
    const { amount, bankAccountNumber } = req.body;
    const transaction = new DepositTransactionModel({
      amount,
      bankAccountNumber,
    });
    await transaction.save();
    return res
      .status(200)
      .json({ success: true, message: "Transaction added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDailyDepositTransactions = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.json(dailyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getDailyDepositTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { bankAccountNumber } = req.body;

    // Calculate the start and end of the current day
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bankAccountNumber: bankAccountNumber,
    });

    res.json(dailyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getMonthlyDepositTransactions = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);

    const monthlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    res.json(monthlyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting monthly transactions" });
  }
};

exports.getYearlyDepositTransactions = async (req, res) => {
  try {
    const { year } = req.body;

    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${parseInt(year) + 1}-01-01`);

    const yearlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });

    res.json(yearlyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting yearly transactions" });
  }
};

exports.addWithdrawlTransaction = async (req, res) => {
  try {
    const { amount, bankAccountNumber } = req.body;
    const transaction = new WithdrawlTransactionModel({
      amount,
      bankAccountNumber,
    });
    await transaction.save();
    return res
      .status(200)
      .json({ success: true, message: "Transaction added successfully.",  });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDailyWithdrawlTransactions = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.json(dailyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getDailyWithdrawlTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { bankAccountNumber } = req.body;

    // Calculate the start and end of the current day
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bankAccountNumber: bankAccountNumber,
    });

    res.json(dailyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getMonthlyWithdrawlTransactions = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);

    const monthlyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    res.json(monthlyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting monthly transactions" });
  }
};

exports.getYearlyWithdrawlTransactions = async (req, res) => {
  try {
    const { year } = req.body;

    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${parseInt(year) + 1}-01-01`);

    const yearlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });

    res.json(yearlyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error getting yearly transactions" });
  }
};