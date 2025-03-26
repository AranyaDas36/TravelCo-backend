const express = require("express")
const { register, login, verifyOTP } = require("./../controllers/authController")
const { authMiddleware } = require("./../middleware/authMiddleware")

const router = express.Router()

// Route to initiate registration and send OTP
router.post("/register", register)

// Route to verify OTP and complete registration
router.post("/verify-otp", verifyOTP)

// Route to login a user
router.post("/login", login)

router.get("/verify-token", authMiddleware, (req, res) => {
  // If the middleware passes, the token is valid
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  })
})

router.get("/me", authMiddleware, (req, res) => {
  // Return user details without sensitive information
  const { id, email, name, role } = req.user
  res.json({
    user: { id, email, name, role },
  })
})

module.exports = router

