const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer")

const userRouter = express.Router();
const {signUp}=require('../models/userSchema');

/*router for signin */

userRouter.post("/register", async (req, res) => {
  const { name, email, phone,password } = req.body;

  try {
    const existingUser = await signUp.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new signUp({
      name,
      email,
      phone,
      password: hashPassword,
    });

    await newUser.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/*router for signin */
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(`All fields are required`);
  }
  signUp
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json(`User not found`);
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(404).json(`Invalid email/password`);
          }
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY
          );
          res.json(token);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
userRouter.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await signUp.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; 
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        text: `To reset your password click on the link:\n${resetLink}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Email sending failed" });
        }
        console.log("Message sent: " + info.response);
        res.status(200).json({ message: "Password reset link sent to your email" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  userRouter.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await signUp.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
module.exports = userRouter;