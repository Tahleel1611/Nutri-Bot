const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(verifyToken);

// User routes
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateProfile);
router.put("/password", userController.updatePassword);

module.exports = router;
