const db = require("../models");
const { Op } = require("sequelize");
const HabitGoal = db.habitGoal;
const WaterIntake = db.waterIntake;
const Meal = db.meal;

// Create or update habit goal
exports.setHabitGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { goalType, targetValue, unit, reminderTimes } = req.body;

    if (!goalType || !targetValue) {
      return res.status(400).json({ message: "Goal type and target value are required" });
    }

    const [goal, created] = await HabitGoal.findOrCreate({
      where: { userId, goalType },
      defaults: {
        targetValue,
        unit: unit || (goalType === 'water' ? 'ml' : 'g'),
        reminderTimes: reminderTimes || [],
        isActive: true
      }
    });

    if (!created) {
      await goal.update({
        targetValue,
        unit: unit || goal.unit,
        reminderTimes: reminderTimes !== undefined ? reminderTimes : goal.reminderTimes,
        isActive: true
      });
    }

    res.status(created ? 201 : 200).json({
      message: created ? "Habit goal created successfully" : "Habit goal updated successfully",
      data: goal
    });
  } catch (error) {
    res.status(500).json({ message: "Error setting habit goal", error: error.message });
  }
};

// Get all habit goals for a user
exports.getAllGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await HabitGoal.findAll({
      where: { userId, isActive: true },
      order: [['goalType', 'ASC']]
    });

    res.status(200).json({
      message: "Habit goals retrieved successfully",
      data: goals
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving habit goals", error: error.message });
  }
};

// Get habit summary with progress and streaks
exports.getHabitSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    // Get all active goals
    const goals = await HabitGoal.findAll({
      where: { userId, isActive: true }
    });

    const summary = [];

    for (const goal of goals) {
      let progress = 0;
      let achieved = false;

      if (goal.goalType === 'water') {
        // Calculate water intake for today
        const waterLogs = await WaterIntake.findAll({
          where: { userId, date: today }
        });

        const totalIntakeMl = waterLogs.reduce((sum, log) => {
          let amountInMl = log.amount;
          if (log.unit === 'oz') amountInMl = log.amount * 29.5735;
          if (log.unit === 'cups') amountInMl = log.amount * 240;
          if (log.unit === 'liters') amountInMl = log.amount * 1000;
          return sum + amountInMl;
        }, 0);

        progress = Math.round((totalIntakeMl / goal.targetValue) * 100);
        achieved = totalIntakeMl >= goal.targetValue;
      } else if (goal.goalType === 'calories') {
        // Calculate calories for today
        const meals = await Meal.findAll({
          where: { userId, date: today }
        });

        const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
        progress = Math.round((totalCalories / goal.targetValue) * 100);
        achieved = Math.abs(totalCalories - goal.targetValue) <= (goal.targetValue * 0.1); // Within 10%
      }

      // Update streak if goal was achieved today
      if (achieved && goal.lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (goal.lastCompletedDate === yesterdayStr) {
          newStreak = goal.currentStreak + 1;
        }

        const newLongestStreak = Math.max(newStreak, goal.longestStreak);

        await goal.update({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedDate: today
        });
      } else if (!achieved && goal.lastCompletedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (goal.lastCompletedDate < yesterdayStr) {
          await goal.update({ currentStreak: 0 });
        }
      }

      summary.push({
        goalType: goal.goalType,
        targetValue: goal.targetValue,
        unit: goal.unit,
        progress: Math.min(progress, 100),
        achieved,
        currentStreak: goal.currentStreak,
        longestStreak: goal.longestStreak,
        reminderTimes: goal.reminderTimes
      });
    }

    res.status(200).json({
      message: "Habit summary retrieved successfully",
      date: today,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving habit summary", error: error.message });
  }
};

// Delete a habit goal
exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { goalType } = req.params;

    const goal = await HabitGoal.findOne({
      where: { userId, goalType }
    });

    if (!goal) {
      return res.status(404).json({ message: "Habit goal not found" });
    }

    await goal.update({ isActive: false });

    res.status(200).json({
      message: "Habit goal deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting habit goal", error: error.message });
  }
};
