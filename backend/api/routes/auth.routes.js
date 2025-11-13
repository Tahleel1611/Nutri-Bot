const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Authentication routes
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/refreshtoken", authController.refreshToken);

module.exports = router;
