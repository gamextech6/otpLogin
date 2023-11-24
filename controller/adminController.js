const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const AdminAgentModel = require("../models/adminAgentModel");
const AWS = require('aws-sdk');
const AdminBankModel = require("../models/adminBankModel")
const { createJwtToken } = require("../util/tokenUtil");
const requestIp = require("request-ip");
const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_Id,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
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

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await AdminModel.findOne({ username, password });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).send({
      sucess: true,
      message: "Login successful"
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createAdminAgent = async (req, res) => {
  try {
    await AdminAgentModel.deleteMany({ userName: null });
    const { userName, firstName, lastName, phoneNo, password } = req.body;

    // await AdminAgentModel.deleteMany({ userName: null });
    // Check if the username is already taken
    const existingUser = await AdminAgentModel.findOne({ userName });

   

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Create a new admin agent
    const newAdminAgent = new AdminAgentModel({
      userName,
      firstName,
      lastName,
      phoneNo,
      password,
    });

    // Save to the database
    await newAdminAgent.save();

    return res.status(200).json({ success: true, message: 'Admin agent created successfully.' });
  } catch (error) {
    console.error('Error creating admin agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllAdminAgents = async (req, res) => {
  try {
    // Find all admin agents
    const adminAgents = await AdminAgentModel.find();

    res.status(200).json({success: true, data: adminAgents});
  } catch (error) {
    console.error('Error getting all admin agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAdminAgentDetails = async (req, res) => {
  try {
    const { userName } = req.params;

    // Find the admin agent by username
    const adminAgent = await AdminAgentModel.findOne({userName });

    // Check if the admin agent exists
    if (!adminAgent) {
      return res.status(404).json({ error: 'Admin agent not found.' });
    }

    // Return the admin agent details
    res.status(200).send({
      sucess: true,
      message: "Agent got successfully",
      data: adminAgent
    });
  } catch (error) {
    console.error('Error getting admin agent details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.blockAdminAgent = async (req, res) => {
  try {
    const { userName } = req.params;

    // Find the admin agent by username
    const adminAgent = await AdminAgentModel.findOne({ userName });

    // Check if the admin agent exists
    if (!adminAgent) {
      return res.status(404).json({ error: 'Admin agent not found.' });
    }

    // Update the admin agent's status to blocked
    adminAgent.blocked = true;

    // Save the updated admin agent to the database
    await adminAgent.save();

    res.status(200).json({ success: true, message: 'Admin agent blocked successfully.' });
  } catch (error) {
    console.error('Error blocking admin agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unblockAdminAgent = async (req, res) => {
  try {
    const { userName } = req.params;

    // Find the admin agent by username
    const adminAgent = await AdminAgentModel.findOne({ userName });

    // Check if the admin agent exists
    if (!adminAgent) {
      return res.status(404).json({ error: 'Admin agent not found.' });
    }

    // Update the admin agent's status to unblocked
    adminAgent.blocked = false;

    // Save the updated admin agent to the database
    await adminAgent.save();

    res.status(200).json({ success: true, message: 'Admin agent unblocked successfully.' });
  } catch (error) {
    console.error('Error unblocking admin agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addAgent = async (req, res) => {
  try {
    const { userName } = req.body;
    // Check if the user exists
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Update the user's role to 'agent'
    user.role = 'agent';
    await user.save();
    res.status(200).json({ success: true, message: 'User role updated to agent.' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    // Find all users with role 'agent'
    const agents = await UserModel.find({ role: 'agent' });
    res.status(200).json({success: true, data: agents});
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchAgentByUsername = async (req, res) => {
  try {
    const { userName } = req.params;
    // Find the user with the given username and role 'agent'
    const agent = await UserModel.findOne({ userName, role: 'agent' });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found.' });
    }
    res.status(200).send({
      sucess: true,
      message: "Agent got successfully",
      data: agent
    });
  } catch (error) {
    console.error('Error searching for agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.blockAgent = async (req, res) => {
  try {
    const { userName } = req.params;
    // Find the agent by username and update the 'blocked' field to true
    const updatedAgent = await UserModel.findOneAndUpdate(
      { userName, role: 'agent' },
      { $set: { agentBlocked: true } },
      { new: true }
    );
    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found.' });
    }
    res.status(200).json({ success: true, message: 'Agent blocked successfully.', agent: updatedAgent });
  } catch (error) {
    console.error('Error blocking agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unblockAgent = async (req, res) => {
  try {
    const { userName } = req.params;
    // Find the agent by username and update the 'blocked' field to false
    const updatedAgent = await UserModel.findOneAndUpdate(
      { userName, role: 'agent' },
      { $set: { agentBlocked: false } },
      { new: true }
    );
    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found.' });
    }
    res.status(200).json({ success: true, message: 'Agent unblocked successfully.', agent: updatedAgent });
  } catch (error) {
    console.error('Error unblocking agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const totalCount = await UserModel.countDocuments();
    res.status(200).send({
      sucess: true,
      totalCount: totalCount
    });
    // res.status(200).json({ success: true, totalCount });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAdminAgentCount = async (req, res) => {
  try {
    const totalCount = await AdminAgentModel.countDocuments();
    res.status(200).send({
      sucess: true,
      totalCount: totalCount
    });
    // res.status(200).json({ success: true, totalCount });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAgentCount = async (req, res) => {
  try {
    const totalCount = await UserModel.countDocuments({ role: 'agent' });
    res.status(200).send({
      sucess: true,
      totalCount: totalCount
    });
    // res.status(200).json({ success: true, totalCount });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.adminAccountAdd = async (req, res) => {
  try {
    const { bankName, branchName, accountHolderName, bankAccountNumber, ifscCode } = req.body;
    const fileName = `accountQR/${bankAccountNumber}_${req.file.originalname}`;
    const params = {
      Bucket: process.env.PAN_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
    };

    const s3UploadResponse = await s3.upload(params).promise();
    const qr = s3UploadResponse.Location;


    const bankDetails = new this.adminBankModel({
    bankName : bankName,
    branchName : branchName,
    accountHolderName : accountHolderName,
    bankAccountNumber : bankAccountNumber,
    ifscCode : ifscCode,
    qr : qr
    });
    // Save user to the database
    await bankDetails.save();
    res.status(200).send({
      sucess: true,
      message: "Account Details submitted successfully.",
    });
  } catch (error) {
    console.error('Error on subbmitting :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
