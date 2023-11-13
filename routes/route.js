const express = require("express");
const router = express.Router();

const { sendOTP, verifyOTP, registerUser, loginUser, resetPassword } = require("../controller/controller");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/reset-password", resetPassword);


module.exports = router;