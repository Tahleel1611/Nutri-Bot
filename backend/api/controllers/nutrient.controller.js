const db = require("../models");
const NutrientLog = db.nutrientLog;
const { Op } = require("sequelize");

// Log food intake
exports.logFood = async (req, res) => {
    try {
        const {
            foodName,
            servingSize = 1,
            servingUnit = "serving",
            calories,
            protein,
            carbs,
            fat,
            fiber,
            mealType,
            notes,
            date
        } = req.body;

        // Validate required fields
        if (!foodName || !calories || !mealType) {
            return res.status(400).send({
                message: "Food name, calories, and meal type are required!"
            });
        }

        // Create nutrient log entry
        const nutrientLog = await NutrientLog.create({
            userId: req.userId,
            date: date || new Date().toISOString().split('T')[0],
            foodName,
            servingSize,
            servingUnit,
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            fiber: fiber || 0,
            mealType,
            notes
        });

        res.status(201).send({
            message: "Food logged successfully!",
            data: nutrientLog
        });
    } catch (error) {
        console.error("Error logging food:", error);
        res.status(500).send({ message: error.message });
    }
};

// Get daily summary
exports.getDailySummary = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];

        // Get all nutrient logs for the specified date
        const logs = await NutrientLog.findAll({
            where: {
                userId: req.userId,
                date: date
            }
        });

        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let mealsLogged = logs.length;

        logs.forEach(log => {
            totalCalories += log.calories || 0;
            totalProtein += log.protein || 0;
            totalCarbs += log.carbs || 0;
            totalFat += log.fat || 0;
        });

        // Get user's calorie target from profile (default to 2000 if not set)
        // In a real app, this would come from the user's profile
        const calorieTarget = 2000; // You can enhance this later

        res.status(200).send({
            date,
            consumedCalories: Math.round(totalCalories),
            remainingCalories: Math.round(calorieTarget - totalCalories),
            mealsLogged,
            macros: {
                protein: Math.round(totalProtein),
                carbs: Math.round(totalCarbs),
                fat: Math.round(totalFat)
            },
            calorieTarget
        });
    } catch (error) {
        console.error("Error getting daily summary:", error);
        res.status(500).send({ message: error.message });
    }
};

// Get meal history
exports.getMealHistory = async (req, res) => {
    try {
        const { startDate, endDate, limit = 50 } = req.query;

        const whereClause = {
            userId: req.userId
        };

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            whereClause.date = {
                [Op.gte]: startDate
            };
        } else if (endDate) {
            whereClause.date = {
                [Op.lte]: endDate
            };
        }

        const logs = await NutrientLog.findAll({
            where: whereClause,
            order: [['date', 'DESC'], ['createdAt', 'DESC']],
            limit: parseInt(limit)
        });

        res.status(200).send({
            meals: logs.map(log => ({
                id: log.id,
                foodId: log.mealId || log.id,
                name: log.foodName,
                calories: log.calories,
                protein: log.protein,
                carbs: log.carbs,
                fat: log.fat,
                servingSize: `${log.servingSize} ${log.servingUnit}`,
                mealType: log.mealType,
                date: log.date,
                notes: log.notes
            }))
        });
    } catch (error) {
        console.error("Error getting meal history:", error);
        res.status(500).send({ message: error.message });
    }
};

// Delete a nutrient log entry
exports.deleteLogEntry = async (req, res) => {
    try {
        const id = req.params.id;

        const log = await NutrientLog.findOne({
            where: {
                id: id,
                userId: req.userId
            }
        });

        if (!log) {
            return res.status(404).send({ message: "Log entry not found." });
        }

        await NutrientLog.destroy({
            where: { id: id }
        });

        res.status(200).send({ message: "Log entry deleted successfully!" });
    } catch (error) {
        console.error("Error deleting log entry:", error);
        res.status(500).send({ message: error.message });
    }
};

// Get weekly summary
exports.getWeeklySummary = async (req, res) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const logs = await NutrientLog.findAll({
            where: {
                userId: req.userId,
                date: {
                    [Op.between]: [
                        startDate.toISOString().split('T')[0],
                        endDate.toISOString().split('T')[0]
                    ]
                }
            },
            order: [['date', 'ASC']]
        });

        // Group by date
        const dailyTotals = {};
        logs.forEach(log => {
            const date = log.date;
            if (!dailyTotals[date]) {
                dailyTotals[date] = {
                    date,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    mealsLogged: 0
                };
            }
            dailyTotals[date].calories += log.calories || 0;
            dailyTotals[date].protein += log.protein || 0;
            dailyTotals[date].carbs += log.carbs || 0;
            dailyTotals[date].fat += log.fat || 0;
            dailyTotals[date].mealsLogged += 1;
        });

        const summary = Object.values(dailyTotals).map(day => ({
            ...day,
            calories: Math.round(day.calories),
            protein: Math.round(day.protein),
            carbs: Math.round(day.carbs),
            fat: Math.round(day.fat)
        }));

        res.status(200).send({ summary });
    } catch (error) {
        console.error("Error getting weekly summary:", error);
        res.status(500).send({ message: error.message });
    }
};

module.exports = exports;
