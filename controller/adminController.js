const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const { createJwtToken } = require("../util/tokenUtil");
const requestIp = require("request-ip");
const TransactionModel = require('../models/TransactionModel');
const BankDetailsModel = require('../models/bankDetailsModel');
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
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  const clientIp = requestIp.getClientIp(req);

  // Send OTP via SMS (use your SMS service integration here)
  client.messages
    .create({
      body: `Your GameX OTP is ${otp}. Please do not share it with anyone. It is valid for 5 minutes.`,
      from: process.env.PHONE_NUMBER,
      to: phoneNumber,
    })
    .then((message) => console.log(message.sid));
  const referrerCode = await generateReferrerCode();

  const user = await AdminModel.findOne({ phoneNumber: phoneNumber });

  if (!user) {
      const newUser = new AdminModel({
        otp: otp,
        phoneNumber: phoneNumber,
        point: "10",
        ip: clientIp,
        os: os,
        role: "Admin",
        referrerCode: referrerCode,
      });
      newUser
        .save()
        .then((savedOTP) => {
          console.log("OTP saved:", savedOTP);
        })
        .catch((error) => {
          console.error("Error saving OTP:", error);
        });
    } else {
    user.otp = otp;
    user.ip = clientIp;
    user.os = os;
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

  const otpDocument = await AdminModel.findOne({ phoneNumber: phoneNumber }) ;

  if (otpDocument) {
    const storedOTP = otpDocument.otp;

    if (userEnteredOTP === storedOTP) {
      const token = createJwtToken({ phoneNumber: otpDocument.phoneNumber });
      console.log(token);
      res.status(201).send({
        sucess: true,
        message: "Logged in successfully",
        role: otpDocument.role,
        // user: {
        //   name: user.name,
        //   email: user.email,
        //   usertype: user.usertype
        // },
        token,
      });
      // res.json({ message: 'Logged in successfully' });
      otpDocument.otp = "";
      otpDocument.save();
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } else {
    res.json({ message: "No OTP found" });
  }
};

exports.addAgent = async (req, res) =>{
    const phoneNumber = req.body.phoneNumber;
    const referrerCode = await generateReferrerCode();
    const agent = await UserModel.findOne({ phoneNumber: phoneNumber });
    if (!agent) {
        const newAgent = new UserModel({
          phoneNumber: phoneNumber,
          role: "agent",
          point: 150,
          referrerCode: referrerCode,
        });
        newAgent
          .save()
          .then((agent) => {
            console.log("Agent :", agent);
          })
          .catch((error) => {
            console.error("Error saving OTP:", error);
          });
      } else {
      agent.role = "agent";
      agent.point = agent.point + 150;
      agent
        .save()
        .then((agent) => {
          console.log("Agent :", agent);
        })
        .catch((error) => {
          console.error("Error saving OTP:", error);
        });
    }
  
    res.json({ message: "Agent add successfully" });
};

exports.deleteAgent = async (req, res) => {

  const phoneNumber = req.body.phoneNumber;

  try {
      const agent = await UserModel.findOneAndDelete({ phoneNumber: phoneNumber, role: "agent" });

      if (agent) {
          res.json({ message: "Agent deleted successfully", agent: agent });
      } else {
          res.json({ message: "Agent not found" });
      }
  } catch (error) {
      console.error("Error deleting agent:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {

  const phoneNumber = req.body.phoneNumber;

  try {
      const agent = await UserModel.findOneAndDelete({ phoneNumber: phoneNumber });

      if (agent) {
          res.json({ message: "User deleted successfully" });
      } else {
          res.json({ message: "User not found" });
      }
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.adminAddMoneyToUser = async (req, res) => {
  const adminPhoneNumber = req.body.adminPhoneNumber;
  const userPhoneNumber = req.body.userPhoneNumber;
  const amount = req.body.amount;

  try {
    const user = await UserModel.findOne({ phoneNumber: userPhoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.point += amount;
    await user.save();

    const transaction = new TransactionModel({
      user: userPhoneNumber,
      admin: adminPhoneNumber,
      amount: amount,
      actionType: 'add',
      timestamp: new Date(),
    });
    await transaction.save();

    // Return the response once
    res.json({ message: "Money added successfully", balance: user.point });
  } catch (error) {
    console.error("Error adding money:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.adminDeductMoneyFromUser = async (req, res) => {
  const adminPhoneNumber = req.body.adminPhoneNumber;
  const userPhoneNumber = req.body.userPhoneNumber;
  const amount = req.body.amount;

  try {
      
      const user = await UserModel.findOne({ phoneNumber: userPhoneNumber });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      if (user.point >= amount) {
          user.point -= amount;
          await user.save();

          const transaction = new TransactionModel({
              user: userPhoneNumber,
              admin: adminPhoneNumber,
              amount: amount,
              actionType: 'deduct',
              timestamp: new Date(),
          });
          await transaction.save();

          res.json({ message: "Money deducted successfully", balance: user.point });
      } else {
          res.status(400).json({ message: "Insufficient funds in the wallet" });
      }
  } catch (error) {
      console.error("Error deducting money:", error);
      res.status(500).json({ error: "Internal server error" });
  }
  res.json({ message: "Ammount Added successfully" });
};

exports.addBankDetails = async (req, res) => {
  try {
      const {
          branchName,
          bankName,
          bankHolder,
          accountNo,
          ifscCode,
          presentAmount,
          qrcode,
      } = req.body;

      // Validate the request body here if needed

      const newBankDetails = new BankDetailsModel({
          branchName,
          bankName,
          bankHolder,
          account_No: accountNo,
          ifsc_code: ifscCode,
          present_amount: presentAmount,
          qrcode,
      });

      const savedBankDetails = await newBankDetails.save();

      res.json({ message: 'Bank details added successfully', data: savedBankDetails });
  } catch (error) {
      console.error('Error adding bank details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBankDetail = async (req, res) => {

  const accountNo = req.body.accountNo;

  try {
      const account = await BankDetailsModel.findOneAndDelete({ accountNo : accountNo });

      if (account) {
          res.json({ message: "Account deleted successfully" });
      } else {
          res.json({ message: "Account not found" });
      }
  } catch (error) {
      console.error("Error deleting Account:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

