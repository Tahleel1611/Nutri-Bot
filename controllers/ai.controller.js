const db = require("../models");
const { Op } = require("sequelize");
const axios = require('axios');
const HabitGoal = db.habitGoal;
const WaterIntake = db.waterIntake;
const Meal = db.meal;

// AI service URL (should be in environment variables)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Get AI-powered habit recommendations
exports.getHabitRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Get user's habit goals
    const goals = await HabitGoal.findAll({
      where: { userId, isActive: true }
    });

    // Get recent water intake data
    const waterLogs = await WaterIntake.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: sevenDaysAgo.toISOString().split('T')[0]
        }
      },
      order: [['date', 'DESC']]
    });

    // Get recent meal data
    const meals = await Meal.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: sevenDaysAgo.toISOString().split('T')[0]
        }
      },
      order: [['date', 'DESC']]
    });

    // Prepare data for AI service
    const habitData = {
      goals: goals.map(g => ({
        type: g.goalType,
        target: g.targetValue,
        unit: g.unit,
        currentStreak: g.currentStreak,
        longestStreak: g.longestStreak
      })),
      waterIntake: waterLogs.map(w => ({
        date: w.date,
        amount: w.amount,
        unit: w.unit
      })),
      meals: meals.map(m => ({
        date: m.date,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat
      })),
      userId
    };

    // Call AI service for recommendations
    let recommendations = [];
    let habitScore = 0;

    try {
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/api/recommend/habits`,
        habitData,
        { timeout: 5000 }
      );
      
      recommendations = aiResponse.data.recommendations || [];
      habitScore = aiResponse.data.habitScore || 0;
    } catch (aiError) {
      console.error('AI Service error:', aiError.message);
      // Fallback to rule-based recommendations
      recommendations = generateBasicRecommendations(goals, waterLogs, meals);
      habitScore = calculateBasicHabitScore(goals, waterLogs, meals);
    }

    res.status(200).json({
      message: "Habit recommendations retrieved successfully",
      data: {
        recommendations,
        habitScore,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error getting habit recommendations", 
      error: error.message 
    });
  }
};

// Fallback: Generate basic rule-based recommendations
function generateBasicRecommendations(goals, waterLogs, meals) {
  const recommendations = [];

  // Water intake recommendation
  const waterGoal = goals.find(g => g.goalType === 'water');
  if (waterGoal && waterLogs.length > 0) {
    const avgWater = waterLogs.reduce((sum, log) => {
      let ml = log.amount;
      if (log.unit === 'oz') ml *= 29.5735;
      if (log.unit === 'cups') ml *= 240;
      if (log.unit === 'liters') ml *= 1000;
      return sum + ml;
    }, 0) / waterLogs.length;

    if (avgWater < waterGoal.targetValue * 0.8) {
      recommendations.push({
        type: 'water',
        message: `Increase your daily water intake by ${Math.round((waterGoal.targetValue - avgWater) / 1000 * 100) / 100}L to meet your goal`,
        priority: 'high'
      });
    }
  }

  // Calorie recommendation
  const calorieGoal = goals.find(g => g.goalType === 'calories');
  if (calorieGoal && meals.length > 0) {
    const avgCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0) / meals.length;
    const diff = Math.abs(avgCalories - calorieGoal.targetValue);
    
    if (diff > calorieGoal.targetValue * 0.15) {
      if (avgCalories < calorieGoal.targetValue) {
        recommendations.push({
          type: 'calories',
          message: `Consider adding ${Math.round(diff)} more calories per day to reach your goal`,
          priority: 'medium'
        });
      } else {
        recommendations.push({
          type: 'calories',
          message: `Try reducing your intake by ${Math.round(diff)} calories per day`,
          priority: 'medium'
        });
      }
    }
  }

  // Streak encouragement
  const activeStreaks = goals.filter(g => g.currentStreak > 0);
  if (activeStreaks.length > 0) {
    recommendations.push({
      type: 'streak',
      message: `Great job! Keep up your ${activeStreaks[0].currentStreak}-day streak on ${activeStreaks[0].goalType}`,
      priority: 'low'
    });
  }

  return recommendations;
}

// Calculate basic habit score
function calculateBasicHabitScore(goals, waterLogs, meals) {
  if (goals.length === 0) return 0;

  let totalScore = 0;
  let goalCount = 0;

  goals.forEach(goal => {
    let achievement = 0;

    if (goal.goalType === 'water' && waterLogs.length > 0) {
      const avgWater = waterLogs.reduce((sum, log) => {
        let ml = log.amount;
        if (log.unit === 'oz') ml *= 29.5735;
        if (log.unit === 'cups') ml *= 240;
        if (log.unit === 'liters') ml *= 1000;
        return sum + ml;
      }, 0) / waterLogs.length;
      achievement = Math.min((avgWater / goal.targetValue) * 100, 100);
    } else if (goal.goalType === 'calories' && meals.length > 0) {
      const avgCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0) / meals.length;
      const diff = Math.abs(avgCalories - goal.targetValue) / goal.targetValue;
      achievement = Math.max(100 - (diff * 100), 0);
    }

    totalScore += achievement;
    goalCount++;
  });

  return goalCount > 0 ? Math.round(totalScore / goalCount) : 0;
}

module.exports = exports;
