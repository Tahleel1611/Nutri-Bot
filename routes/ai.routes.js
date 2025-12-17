const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/authJwt');

// All routes require authentication
router.use(verifyToken);

// Get AI-powered habit recommendations
router.get('/recommendations/habits', aiController.getHabitRecommendations);

module.exports = router;
