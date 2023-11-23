const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const AdminAgentModel = require("../models/adminAgentModel");
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
    const { userName, firstName, lastName, phoneNo, password } = req.body;

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


