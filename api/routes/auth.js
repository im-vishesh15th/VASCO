const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_MAIL_SEC,
  },
});

router.post('/send-otp', async (req, res) => {

  const { email } = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;

    const mailOptions = {
      from: process.env.MY_MAIL,
      to: email,
      subject: 'VASCO Account Password Reset OTP',
      html: `
      <p>Dear Customer,</p>
      <p>We received a request to reset your password for your VASCO account. Please use the OTP below to verify your identity and reset your password:</p>
      <h2>${otp}</h2>
      <p>If you did not request this change, please ignore this email.</p>
      <p>Thank you,</p>
      <p>VASCO Team</p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
      } else {
        console.log("Email sent:", info.response);
        res.json({ success: true, message: 'OTP sent' });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // OTP used, delete it from store
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

router.post('/reset', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(406).json({ success: false, message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
    console.log("hi");
    res.json({ success: true, message: 'Password reset successful' });
    console.log("hi");
  } catch (err) {
    console.log(err);
    console.error("Error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// REGISTER
router.post("/register", async (req, res) => {

  if (!req.body.img) {
    req.body.img = "https://picsum.photos/200/300";
  }

  const { username, email, password, img } = req.body;

  try {
    // Check if user already exists
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ error: "Confirm Password is Different... " });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists..." });
    }
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ error: "An Account Already exists with this Email-id... " });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword, img: img });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {

    res.status(500).json({ error: "Internal server eror" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {

      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare passwords

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {

      return res.status(401).json({ error: "Invalid username or password" });
    }


    // Generate access token
    const accessToken = jwt.sign(
      { id: user._id.ObjectId, isAdmin: user.isAdmin },
      "vishesh",
      { expiresIn: "2h" }
    );

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({ ...userWithoutPassword, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
