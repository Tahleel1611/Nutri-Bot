const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth.controller");

// Rate limiter for auth endpoints (5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for token refresh (10 requests per 15 minutes)
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Slightly higher limit for token refresh
  message: "Too many token refresh attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication routes
router.post("/signup", authLimiter, authController.signup);
router.post("/signin", authLimiter, authController.signin);
router.post("/refreshtoken", refreshLimiter, authController.refreshToken);

module.exports = router;
