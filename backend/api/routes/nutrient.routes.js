const express = require("express");
const router = express.Router();
const nutrientController = require("../controllers/nutrient.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(verifyToken);

// Nutrient log routes
router.post("/log", nutrientController.logFood);
router.get("/summary/daily", nutrientController.getDailySummary);
router.get("/summary/weekly", nutrientController.getWeeklySummary);
router.get("/history", nutrientController.getMealHistory);
router.delete("/log/:id", nutrientController.deleteLogEntry);

module.exports = router;
