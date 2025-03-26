const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./../models/User")
require("dotenv").config()
const nodemailer = require("nodemailer")

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log("Received registration request for:", email)

    // Check if user already exists and is verified (no OTP field)
    let user = await User.findOne({ email, otp: { $exists: false } })
    if (user) {
      console.log("User already exists and is verified:", email)
      return res.status(400).json({ message: "User already exists" })
    }

    // Check if user exists but is not verified (has OTP field)
    user = await User.findOne({ email, otp: { $exists: true } })

    // Generate OTP and expiration
    const otp = generateOTP()
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes

    if (user) {
      // Update existing unverified user
      user.otp = otp
      user.otpExpiration = otpExpiration
      if (name) user.name = name
      if (password) user.password = password
    } else {
      // Create a new user
      user = new User({
        name,
        email,
        password,
        otp,
        otpExpiration,
      })
    }

    // Log user object before saving
    console.log("User object to save:", user)

    // Save user to database
    await user.save()

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Signup",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Travel Horizon - Email Verification</h2>
          <p>Hello${name ? " " + name : ""},</p>
          <p>Thank you for registering with Travel Horizon. To complete your registration, please use the following One-Time Password (OTP):</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            &copy; ${new Date().getFullYear()} Travel Horizon. All rights reserved.
          </p>
        </div>
      `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error)
        return res.status(500).json({ message: "Failed to send OTP email", error: error.message })
      }
      console.log("Email sent:", info.response)
      res.status(200).json({ message: "OTP sent to your email" })
    })
  } catch (error) {
    console.error("Error in register route:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    console.log("Verifying OTP for email:", email, "OTP:", otp)

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      console.log("User not found for email:", email)
      return res.status(400).json({ message: "User not found" })
    }

    console.log("User found:", user)
    console.log("Stored OTP:", user.otp)
    console.log("OTP Expiration:", user.otpExpiration)

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      console.log("Invalid or expired OTP")
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    // Clear OTP fields
    user.otp = undefined
    user.otpExpiration = undefined
    user.isVerified = true // Mark user as verified
    await user.save()

    console.log("OTP verified successfully")
    res.status(200).json({ message: "Registration completed successfully!" })
  } catch (error) {
    console.error("Error in verifyOTP:", error)
    res.status(500).json({ message: "Server error" })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    // Check if the user exists
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    // Check if user is verified
    if (user.otp) {
      return res.status(401).json({
        message: "Email not verified. Please complete verification.",
        needsVerification: true,
        email: user.email,
      })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })

    // Send back token and user data
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error in login:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

