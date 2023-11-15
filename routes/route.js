const express = require("express");
const router = express.Router();

const { sendOTP, verifyOTP, registerUser, loginUser, resetPassword, updateUserProfile, getUserProfile, getUserBalance, getUserReferralCode } = require("../controller/controller");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/reset-password", resetPassword);
router.put("/profile/:phoneNumber", updateUserProfile);
router.get("/profile/:phoneNumber", getUserProfile);
router.get("/user-balance/:phoneNumber", getUserBalance);
router.get("/user-raferral/:phoneNumber", getUserReferralCode);

module.exports = router;