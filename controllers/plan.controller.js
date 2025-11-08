const db = require("../models");
const axios = require("axios");
const { Op } = require("sequelize");

const DietPlan = db.dietPlan;
const Meal = db.meal;
const Profile = db.profile;

// Get all diet plans for a user
exports.getUserPlans = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const plans = await DietPlan.findAndCountAll({
      where: { userId: userId },
      include: [{
        model: Meal,
        as: 'meals'
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      plans: plans.rows,
      totalItems: plans.count,
      totalPages: Math.ceil(plans.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({
      message: "Error retrieving diet plans",
      error: error.message
    });
  }
};

// Get diet plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const userId = req.userId;
    const planId = req.params.id;

    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: userId
      },
      include: [{
        model: Meal,
        as: 'meals'
      }]
    });

    if (!plan) {
      return res.status(404).json({
        message: "Diet plan not found"
      });
    }

    res.status(200).json({
      plan: plan
    });
  } catch (error) {
    console.error("Get plan error:", error);
    res.status(500).json({
      message: "Error retrieving diet plan",
      error: error.message
    });
  }
};

// Create new diet plan
exports.createPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      description,
      goal,
      dailyCalories,
      dailyProtein,
      dailyCarbs,
      dailyFat,
      duration,
      isActive
    } = req.body;

    // Validation
    if (!name || !dailyCalories) {
      return res.status(400).json({
        message: "Plan name and daily calories are required"
      });
    }

    const plan = await DietPlan.create({
      userId: userId,
      name: name,
      description: description || '',
      goal: goal || 'maintenance',
      dailyCalories: parseFloat(dailyCalories),
      dailyProtein: parseFloat(dailyProtein) || 0,
      dailyCarbs: parseFloat(dailyCarbs) || 0,
      dailyFat: parseFloat(dailyFat) || 0,
      duration: parseInt(duration) || 7,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: "Diet plan created successfully",
      plan: plan
    });
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(500).json({
      message: "Error creating diet plan",
      error: error.message
    });
  }
};

// Update diet plan
exports.updatePlan = async (req, res) => {
  try {
    const userId = req.userId;
    const planId = req.params.id;
    const {
      name,
      description,
      goal,
      dailyCalories,
      dailyProtein,
      dailyCarbs,
      dailyFat,
      duration,
      isActive
    } = req.body;

    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: userId
      }
    });

    if (!plan) {
      return res.status(404).json({
        message: "Diet plan not found"
      });
    }

    await plan.update({
      name: name !== undefined ? name : plan.name,
      description: description !== undefined ? description : plan.description,
      goal: goal !== undefined ? goal : plan.goal,
      dailyCalories: dailyCalories !== undefined ? parseFloat(dailyCalories) : plan.dailyCalories,
      dailyProtein: dailyProtein !== undefined ? parseFloat(dailyProtein) : plan.dailyProtein,
      dailyCarbs: dailyCarbs !== undefined ? parseFloat(dailyCarbs) : plan.dailyCarbs,
      dailyFat: dailyFat !== undefined ? parseFloat(dailyFat) : plan.dailyFat,
      duration: duration !== undefined ? parseInt(duration) : plan.duration,
      isActive: isActive !== undefined ? isActive : plan.isActive
    });

    res.status(200).json({
      message: "Diet plan updated successfully",
      plan: plan
    });
  } catch (error) {
    console.error("Update plan error:", error);
    res.status(500).json({
      message: "Error updating diet plan",
      error: error.message
    });
  }
};

// Delete diet plan
exports.deletePlan = async (req, res) => {
  try {
    const userId = req.userId;
    const planId = req.params.id;

    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: userId
      }
    });

    if (!plan) {
      return res.status(404).json({
        message: "Diet plan not found"
      });
    }

    await plan.destroy();

    res.status(200).json({
      message: "Diet plan deleted successfully"
    });
  } catch (error) {
    console.error("Delete plan error:", error);
    res.status(500).json({
      message: "Error deleting diet plan",
      error: error.message
    });
  }
};

// Generate AI-powered diet plan
exports.generateAiPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const { duration = 7 } = req.body;

    // Get user profile
    const profile = await Profile.findOne({
      where: { userId: userId }
    });

    if (!profile) {
      return res.status(404).json({
        message: "User profile not found. Please complete your profile first."
      });
    }

    // Call AI service to generate diet plan
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
    
    try {
      const response = await axios.post(`${aiServiceUrl}/api/generate/diet-plan`, {
        profile: {
          age: profile.age,
          gender: profile.gender,
          weight: profile.weight,
          height: profile.height,
          activityLevel: profile.activityLevel,
          goal: profile.goal,
          dietaryRestrictions: profile.dietaryRestrictions,
          allergies: profile.allergies
        },
        duration: duration
      });

      const aiPlan = response.data.diet_plan;

      // Create diet plan in database
      const plan = await DietPlan.create({
        userId: userId,
        name: aiPlan.name,
        description: aiPlan.description,
        goal: aiPlan.goal,
        dailyCalories: aiPlan.dailyCalories,
        dailyProtein: aiPlan.dailyProtein,
        dailyCarbs: aiPlan.dailyCarbs,
        dailyFat: aiPlan.dailyFat,
        duration: duration,
        isActive: true
      });

      res.status(201).json({
        message: "AI-generated diet plan created successfully",
        plan: plan,
        aiData: aiPlan
      });
    } catch (aiError) {
      console.error("AI service error:", aiError);
      return res.status(503).json({
        message: "AI service is currently unavailable. Please try again later.",
        error: aiError.message
      });
    }
  } catch (error) {
    console.error("Generate AI plan error:", error);
    res.status(500).json({
      message: "Error generating AI diet plan",
      error: error.message
    });
  }
};

// Add meal to diet plan
exports.addMealToPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: planId, mealId } = req.params;

    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: userId
      }
    });

    if (!plan) {
      return res.status(404).json({
        message: "Diet plan not found"
      });
    }

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

    // Update meal to associate with plan
    await meal.update({ dietPlanId: planId });

    res.status(200).json({
      message: "Meal added to diet plan successfully"
    });
  } catch (error) {
    console.error("Add meal to plan error:", error);
    res.status(500).json({
      message: "Error adding meal to diet plan",
      error: error.message
    });
  }
};

// Remove meal from diet plan
exports.removeMealFromPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: planId, mealId } = req.params;

    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: userId
      }
    });

    if (!plan) {
      return res.status(404).json({
        message: "Diet plan not found"
      });
    }

    const meal = await Meal.findOne({
      where: {
        id: mealId,
        userId: userId,
        dietPlanId: planId
      }
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found in this diet plan"
      });
    }

    // Remove meal from plan
    await meal.update({ dietPlanId: null });

    res.status(200).json({
      message: "Meal removed from diet plan successfully"
    });
  } catch (error) {
    console.error("Remove meal from plan error:", error);
    res.status(500).json({
      message: "Error removing meal from diet plan",
      error: error.message
    });
  }
};
