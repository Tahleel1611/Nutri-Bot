const db = require("../models");
const { Op } = require("sequelize");

const Meal = db.meal;
const User = db.user;

// Get all meals for a user
exports.getAllMeals = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { userId: userId };

    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`
      };
    }

    const meals = await Meal.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      meals: meals.rows,
      totalItems: meals.count,
      totalPages: Math.ceil(meals.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("Get meals error:", error);
    res.status(500).json({
      message: "Error retrieving meals",
      error: error.message
    });
  }
};

// Get recommended meals
exports.getRecommendedMeals = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user profile to determine preferences
    const user = await User.findByPk(userId, {
      include: [{
        model: db.profile,
        as: 'profile'
      }]
    });

    if (!user || !user.profile) {
      return res.status(404).json({
        message: "User profile not found"
      });
    }

    // Get meals that match user's goals
    const meals = await Meal.findAll({
      where: {
        userId: userId
      },
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      meals: meals
    });
  } catch (error) {
    console.error("Get recommended meals error:", error);
    res.status(500).json({
      message: "Error retrieving recommended meals",
      error: error.message
    });
  }
};

// Get meal by ID
exports.getMealById = async (req, res) => {
  try {
    const userId = req.userId;
    const mealId = req.params.id;

    const meal = await Meal.findOne({
      where: {
        id: mealId,
        userId: userId
      }
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    res.status(200).json({
      meal: meal
    });
  } catch (error) {
    console.error("Get meal error:", error);
    res.status(500).json({
      message: "Error retrieving meal",
      error: error.message
    });
  }
};

// Create new meal
exports.createMeal = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      description,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      mealType,
      ingredients,
      instructions
    } = req.body;

    // Validation
    if (!name || !calories) {
      return res.status(400).json({
        message: "Meal name and calories are required"
      });
    }

    const meal = await Meal.create({
      userId: userId,
      name: name,
      description: description || '',
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      fiber: parseFloat(fiber) || 0,
      mealType: mealType || 'other',
      ingredients: ingredients || [],
      instructions: instructions || ''
    });

    res.status(201).json({
      message: "Meal created successfully",
      meal: meal
    });
  } catch (error) {
    console.error("Create meal error:", error);
    res.status(500).json({
      message: "Error creating meal",
      error: error.message
    });
  }
};

// Update meal
exports.updateMeal = async (req, res) => {
  try {
    const userId = req.userId;
    const mealId = req.params.id;
    const {
      name,
      description,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      mealType,
      ingredients,
      instructions
    } = req.body;

    const meal = await Meal.findOne({
      where: {
        id: mealId,
        userId: userId
      }
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    await meal.update({
      name: name !== undefined ? name : meal.name,
      description: description !== undefined ? description : meal.description,
      calories: calories !== undefined ? parseFloat(calories) : meal.calories,
      protein: protein !== undefined ? parseFloat(protein) : meal.protein,
      carbs: carbs !== undefined ? parseFloat(carbs) : meal.carbs,
      fat: fat !== undefined ? parseFloat(fat) : meal.fat,
      fiber: fiber !== undefined ? parseFloat(fiber) : meal.fiber,
      mealType: mealType !== undefined ? mealType : meal.mealType,
      ingredients: ingredients !== undefined ? ingredients : meal.ingredients,
      instructions: instructions !== undefined ? instructions : meal.instructions
    });

    res.status(200).json({
      message: "Meal updated successfully",
      meal: meal
    });
  } catch (error) {
    console.error("Update meal error:", error);
    res.status(500).json({
      message: "Error updating meal",
      error: error.message
    });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const userId = req.userId;
    const mealId = req.params.id;

    const meal = await Meal.findOne({
      where: {
        id: mealId,
        userId: userId
      }
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    await meal.destroy();

    res.status(200).json({
      message: "Meal deleted successfully"
    });
  } catch (error) {
    console.error("Delete meal error:", error);
    res.status(500).json({
      message: "Error deleting meal",
      error: error.message
    });
  }
};
