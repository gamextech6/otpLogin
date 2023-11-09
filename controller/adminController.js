const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
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
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  const clientIp = requestIp.getClientIp(req);

  // Send OTP via SMS (use your SMS service integration here)
  // client.messages
  //   .create({
  //     body: `Your GameX OTP is ${otp}. Please do not share it with anyone. It is valid for 5 minutes.`,
  //     from: process.env.PHONE_NUMBER,
  //     to: phoneNumber,
  //   })
  //   .then((message) => console.log(message.sid));
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