const db = require("../models");
const { Op } = require("sequelize");

const WaterIntake = db.waterIntake;
const User = db.user;

// Log water intake
exports.logWaterIntake = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, unit, date, notes } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const waterLog = await WaterIntake.create({
      userId,
      amount,
      unit: unit || 'ml',
      date: date || new Date(),
      notes
    });

    res.status(201).json({
      message: "Water intake logged successfully",
      data: waterLog
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging water intake", error: error.message });
  }
};

// Get all water intake logs for a user
exports.getAllWaterLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { userId };

    // Date filtering
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    const waterLogs = await WaterIntake.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: "Water logs retrieved successfully",
      data: waterLogs.rows,
      pagination: {
        total: waterLogs.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(waterLogs.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving water logs", error: error.message });
  }
};

// Get water intake by date
exports.getWaterByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.params;

    const waterLogs = await WaterIntake.findAll({
      where: {
        userId,
        date
      },
      order: [['createdAt', 'ASC']]
    });

    // Calculate total intake
    const totalIntake = waterLogs.reduce((sum, log) => {
      // Convert all to ml for consistency
      let amountInMl = log.amount;
      if (log.unit === 'oz') amountInMl = log.amount * 29.5735;
      if (log.unit === 'cups') amountInMl = log.amount * 240;
      if (log.unit === 'liters') amountInMl = log.amount * 1000;
      return sum + amountInMl;
    }, 0);

    res.status(200).json({
      message: "Water logs for date retrieved successfully",
      data: waterLogs,
      summary: {
        totalIntakeMl: Math.round(totalIntake),
        totalIntakeLiters: (totalIntake / 1000).toFixed(2),
        logsCount: waterLogs.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving water logs", error: error.message });
  }
};

// Update water intake log
exports.updateWaterLog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { amount, unit, date, notes } = req.body;

    const waterLog = await WaterIntake.findOne({
      where: { id, userId }
    });

    if (!waterLog) {
      return res.status(404).json({ message: "Water log not found" });
    }

    await waterLog.update({
      amount: amount || waterLog.amount,
      unit: unit || waterLog.unit,
      date: date || waterLog.date,
      notes: notes !== undefined ? notes : waterLog.notes
    });

    res.status(200).json({
      message: "Water log updated successfully",
      data: waterLog
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating water log", error: error.message });
  }
};

// Delete water intake log
exports.deleteWaterLog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const waterLog = await WaterIntake.findOne({
      where: { id, userId }
    });

    if (!waterLog) {
      return res.status(404).json({ message: "Water log not found" });
    }

    await waterLog.destroy();

    res.status(200).json({
      message: "Water log deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting water log", error: error.message });
  }
};

// Get weekly water intake statistics
exports.getWeeklyStats = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const waterLogs = await WaterIntake.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: sevenDaysAgo.toISOString().split('T')[0]
        }
      },
      order: [['date', 'ASC']]
    });

    // Group by date and calculate daily totals
    const dailyStats = {};
    waterLogs.forEach(log => {
      const date = log.date;
      if (!dailyStats[date]) {
        dailyStats[date] = { totalMl: 0, logs: 0 };
      }
      
      let amountInMl = log.amount;
      if (log.unit === 'oz') amountInMl = log.amount * 29.5735;
      if (log.unit === 'cups') amountInMl = log.amount * 240;
      if (log.unit === 'liters') amountInMl = log.amount * 1000;
      
      dailyStats[date].totalMl += amountInMl;
      dailyStats[date].logs += 1;
    });

    res.status(200).json({
      message: "Weekly statistics retrieved successfully",
      data: dailyStats,
      summary: {
        averageDailyIntakeMl: Math.round(
          Object.values(dailyStats).reduce((sum, day) => sum + day.totalMl, 0) / 7
        ),
        daysTracked: Object.keys(dailyStats).length
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving statistics", error: error.message });
  }
};
