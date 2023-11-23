const express = require("express");
const router = express.Router();
const multer = require('multer');

const { 
    sendOTP, 
    sendForgetOTP, 
    verifyOTP, 
    registerUser, 
    loginUser, 
    resetPassword, 
    updateUserProfile, 
    getUserProfile, 
    getUserBalance, 
    getUserReferralCode, 
    getAllUsers, 
    blockUser, 
    searchUserByUsername, 
    unblockUser,
    userAccountAdd,
    uploadPan,
    uploadAadhar
    } = require("../controller/controller");

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/send-otp", sendOTP);
router.post("/send-forgetotp", sendForgetOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/reset-password", resetPassword);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);
router.put("/profile/:phoneNumber", updateUserProfile);
router.get("/profile/:phoneNumber", getUserProfile);
router.get("/user-balance/:phoneNumber", getUserBalance);
router.get("/user-raferral/:phoneNumber", getUserReferralCode);
router.get("/getalluser", getAllUsers);
router.get("/search/:username", searchUserByUsername);
router.post("/account-details/:phoneNumber", userAccountAdd);
router.post("/upload-pan/:phoneNumber", upload.single('pan'), uploadPan);
router.post("/upload-aadhar/:phoneNumber", upload.single('aadhar'), uploadAadhar);

module.exports = router;