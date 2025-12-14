const express = require('express');
const router = express.Router();
const waterIntakeController = require('../controllers/waterIntake.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(verifyToken);

// Water intake routes
router.post('/', waterIntakeController.logWaterIntake);
router.get('/', waterIntakeController.getAllWaterLogs);
router.get('/stats/weekly', waterIntakeController.getWeeklyStats);
router.get('/:date', waterIntakeController.getWaterByDate);
router.put('/:id', waterIntakeController.updateWaterLog);
router.delete('/:id', waterIntakeController.deleteWaterLog);

module.exports = router;
