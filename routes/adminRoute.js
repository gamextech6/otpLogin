const express = require("express");
const router = express.Router();


const { sendOTP, verifyOTP, addAgent } = require("../controller/adminController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/add-agent", addAgent);


module.exports = router;