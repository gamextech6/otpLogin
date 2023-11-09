const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const router = express.Router();
const port = process.env.PORT || 3000;

// Firebase and Twilio dependencies
const admin = require('firebase-admin');


// Models
const UserModel = require('./models/userModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Successfully Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Phone OTP Authentication API');
});

// Routes
const routes = require('./routes/route');
const adminRoutes = require('./routes/adminRoute');
app.use('/', routes);
app.use('/admin/', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});