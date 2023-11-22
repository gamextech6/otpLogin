const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, addAgent, deleteAgent, deleteUser, adminDeductMoneyFromUser, adminAddMoneyToUser, addBankDetails, deleteBankDetail, adminLogin } = require("../controller/adminController");


router.post("/admin-login", adminLogin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/add-agent", addAgent);
router.post("/delete-agent", deleteAgent);
router.post("/deduct-money", adminDeductMoneyFromUser);
router.post("/add-money", adminAddMoneyToUser);
router.post("/delete-user", deleteUser);
router.post("/add-bankaccount", addBankDetails);
router.post("/delete-bankaccount", deleteBankDetail);

module.exports = router;