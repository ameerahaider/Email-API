const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');

// USE HTTP STATUS CODE LIBRARY
// External service to ensure services Queues, Kafka
// SEEDING in SQL DB
// MIGRATION in SQL DB

let finalFailedEmails = [];
let emailsSending = false;

// Simple email validation function
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const createUser = async (req, res) => {
  console.log("hello");
  console.log(req.body);
  try {
    const { username, email, password, phone } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }
    const user = await User.create({ username, email, password, phone });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendEmails = async (req, res) => {
  try {

    emailsSending = true;
    res.status(200).json({ message: 'Email sending has started.' });

    const users = await User.findAll();
    //res.json(users);

    let invalidEmails = [];

    for (const user of users) {
      if ( isValidEmail(user.email) ){
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Sending email to: ${user.email}`);
      }
      else {
        invalidEmails.push(user.email);
      }
    }

    //Retrying Sending Failed Emails
    for (const email of invalidEmails) {
      if (isValidEmail(email)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Retry sending email to: ${email}`);
      } else {
        console.log(`Still invalid email: ${email}`);
        finalFailedEmails.push(email);
      }
    }    
    emailsSending = false;
  } catch (error) {
    res.status(400).json({ error: error.message });

  }
}

const seefailedEmail = async (req, res) => {
  try {

    if (emailsSending) {
      res.status(503).json({ message: 'Emails are currently being sent. Please wait and try again later.' });
    } else {
      if (finalFailedEmails.length > 0) {
        res.status(200).json({ message: `Failed to send emails to the following addresses after retrying: ${finalFailedEmails.join(', ')}` });
      } else {
        res.status(400).json({ message: `All Emails sent successfully.` });
      }
    }


  } catch (error) {
  }
}

module.exports = {
  createUser,
  sendEmails,
  seefailedEmail
};
