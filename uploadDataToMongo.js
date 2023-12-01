const mongoose = require('mongoose');
const fs = require('fs');
const DialCodeModel = require('./models/dialCodeModel');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const rawData = fs.readFileSync('dial_code.json');
const dialCodeData = JSON.parse(rawData);

async function uploadData() {
  try {
    await DialCodeModel.deleteMany();
    await DialCodeModel.insertMany(dialCodeData);
    console.log('Data uploaded successfully.');
  } catch (error) {
    console.error('Error uploading data:', error);
  } finally {
    mongoose.disconnect();
  }
}

uploadData();
