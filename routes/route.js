const express = require("express");
const router = express.Router();

const { sendOTP, sendForgetOTP, verifyOTP, registerUser, loginUser, resetPassword, updateUserProfile, getUserProfile, getUserBalance, getUserReferralCode, getAllUsers, blockUser, searchUserByUsername} = require("../controller/controller");

router.post("/send-otp", sendOTP);
router.post("/send-forgetotp", sendForgetOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/reset-password", resetPassword);
router.post("/block-user", blockUser);
router.put("/profile/:phoneNumber", updateUserProfile);
router.get("/profile/:phoneNumber", getUserProfile);
router.get("/user-balance/:phoneNumber", getUserBalance);
router.get("/user-raferral/:phoneNumber", getUserReferralCode);
router.get("/getalluser", getAllUsers);
router.get("/search/:username", searchUserByUsername);

module.exports = router;