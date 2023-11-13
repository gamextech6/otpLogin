const UserModel = require("../models/userModel");
const AdminModel = require("../models/adminModel");
const { createJwtToken } = require("../util/tokenUtil");
const requestIp = require("request-ip");
const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const os = require("os").platform();

const generateReferrerCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-character code (you can adjust the length)
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
    
    // Check if the code is unique
    const existingUser = await (UserModel.findOne({ referrerCode: code }) || AdminModel.findOne({ referrerCode: code }));
    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
};

exports.sendOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(otp);


  // Send OTP via SMS (use your SMS service integration here)
  client.messages
    .create({
      body: `Your GameX OTP is ${otp}. Please do not share it with anyone. It is valid for 5 minutes.`,
      from: process.env.PHONE_NUMBER,
      to: phoneNumber,
    })
    .then((message) => console.log(message.sid));

  const user = await UserModel.findOne({ phoneNumber: phoneNumber });

  if (!user) {
     const newUser = new UserModel ({
      phoneNumber : phoneNumber,
      otp : otp
     })
     newUser.save()
      // res.json.status(false)({message: "User Not Found. Please resister first."});
    } else {
    user.otp = otp;
    user
      .save()
      .then((savedOTP) => {
        console.log("OTP saved:", savedOTP);
      })
      .catch((error) => {
        console.error("Error saving OTP:", error);
      });
  }

  res.json({ message: "OTP sent successfully" });
};

exports.verifyOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const userEnteredOTP = req.body.otp;

  const otpDocument = await UserModel.findOne({ phoneNumber: phoneNumber }) ;

  if (otpDocument) {
    const storedOTP = otpDocument.otp;

    if (userEnteredOTP === storedOTP) {
      const token = createJwtToken({ phoneNumber: otpDocument.phoneNumber });
      console.log(token);
      res.status(200).send({
        sucess: true,
        message: "Logged in successfully",
        role: otpDocument.role,
        token,
      });
     
      otpDocument.otp = "";
      otpDocument.save();
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } else {
    res.json({ message: "No OTP found" });
  }
};


exports.registerUser = async (req, res) => {
  try {
    const { userName, password, phoneNumber, otp } = req.body;
    const referrerCode = await generateReferrerCode();
    const clientIp = requestIp.getClientIp(req);

    const newUser = new UserModel({
      userName,
      password,
      phoneNumber,
      otp,
      ip: clientIp,
      os: os,
      referrerCode: referrerCode,
    });

    // Save user to the database
    await newUser.save();

    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ userName, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    // Update user's password in the database
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerWithReferral = async (req, res) => {
  const { phoneNumber, referralCode } = req.body;
  //Check that is user alrady exist of not 
  const user = await UserModel.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    try {
      // Check if the referral code exists in the database
      const referrer = await UserModel.findOne({ referrerCode: referralCode });
      if (!referrer) {
        return res.status(400).json({ message: "Referral code not found." });
      } 
      
      const newUser = new UserModel({
        otp: otp,
        phoneNumber: phoneNumber,
        point: 100,
        ip: clientIp,
        os: os,
        referredCode: referrerCode, // Store the referrer's code
      });

      // Save the new user
      await newUser.save();

      res.json({ message: "User registered with referral." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed." });
    }
  }
  res.json
};


