const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const { verifyToken } = require('../middleware/authJwt');

// All routes require authentication
router.use(verifyToken);

// Set or update a habit goal
router.post('/goals', habitController.setHabitGoal);

// Get all habit goals
router.get('/goals', habitController.getAllGoals);

// Get habit summary with progress and streaks
router.get('/summary', habitController.getHabitSummary);

// Delete a habit goal
router.delete('/goals/:goalType', habitController.deleteGoal);

module.exports = router;
