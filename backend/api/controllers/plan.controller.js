const db = require("../models");
const DietPlan = db.dietPlan;
const Meal = db.meal;

// Get all diet plans for the current user
exports.getUserPlans = async (req, res) => {
  try {
    const plans = await DietPlan.findAll({
      where: {
        userId: req.userId
      }
    });
    res.status(200).send(plans);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get diet plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: [{
        model: Meal,
        as: "meals"
      }]
    });
    
    if (!plan) {
      return res.status(404).send({ message: "Diet plan not found." });
    }
    
    res.status(200).send(plan);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a new diet plan
exports.createPlan = async (req, res) => {
  try {
    // Create diet plan
    const plan = await DietPlan.create({
      ...req.body,
      userId: req.userId
    });
    
    res.status(201).send(plan);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a diet plan
exports.updatePlan = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if plan exists and belongs to the user
    const plan = await DietPlan.findOne({
      where: {
        id: id,
        userId: req.userId
      }
    });
    
    if (!plan) {
      return res.status(404).send({ message: "Diet plan not found." });
    }
    
    // Update plan
    await DietPlan.update(req.body, {
      where: { id: id }
    });
    
    res.status(200).send({ message: "Diet plan updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a diet plan
exports.deletePlan = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if plan exists and belongs to the user
    const plan = await DietPlan.findOne({
      where: {
        id: id,
        userId: req.userId
      }
    });
    
    if (!plan) {
      return res.status(404).send({ message: "Diet plan not found." });
    }
    
    // Delete plan
    await DietPlan.destroy({
      where: { id: id }
    });
    
    res.status(200).send({ message: "Diet plan deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Generate AI diet plan
exports.generateAiPlan = async (req, res) => {
  try {
    // In a real application, this would call the AI service to generate a personalized diet plan
    // For now, we'll just create a placeholder plan
    
    const { name, goal, dailyCalories } = req.body;
    
    // Create diet plan
    const plan = await DietPlan.create({
      name: name || "AI Generated Plan",
      description: "This is an AI-generated diet plan based on your profile and goals.",
      goal: goal || "weight_loss",
      dailyCalories: dailyCalories || 2000,
      dailyProtein: dailyCalories ? dailyCalories * 0.3 / 4 : 150, // 30% of calories from protein
      dailyCarbs: dailyCalories ? dailyCalories * 0.4 / 4 : 200,   // 40% of calories from carbs
      dailyFat: dailyCalories ? dailyCalories * 0.3 / 9 : 67,      // 30% of calories from fat
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days plan
      userId: req.userId,
      isAiGenerated: true,
      aiGenerationParams: req.body
    });
    
    // In a real application, we would also create meals for this plan
    // by calling the AI service
    
    res.status(201).send(plan);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Add a meal to a diet plan
exports.addMealToPlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const mealId = req.params.mealId;
    
    // Check if plan exists and belongs to the user
    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: req.userId
      }
    });
    
    if (!plan) {
      return res.status(404).send({ message: "Diet plan not found." });
    }
    
    // Check if meal exists
    const meal = await Meal.findByPk(mealId);
    
    if (!meal) {
      return res.status(404).send({ message: "Meal not found." });
    }
    
    // Update meal to associate it with the plan
    await Meal.update(
      { dietPlanId: planId },
      { where: { id: mealId } }
    );
    
    res.status(200).send({ message: "Meal added to diet plan successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Remove a meal from a diet plan
exports.removeMealFromPlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const mealId = req.params.mealId;
    
    // Check if plan exists and belongs to the user
    const plan = await DietPlan.findOne({
      where: {
        id: planId,
        userId: req.userId
      }
    });
    
    if (!plan) {
      return res.status(404).send({ message: "Diet plan not found." });
    }
    
    // Check if meal exists and belongs to the plan
    const meal = await Meal.findOne({
      where: {
        id: mealId,
        dietPlanId: planId
      }
    });
    
    if (!meal) {
      return res.status(404).send({ message: "Meal not found in this diet plan." });
    }
    
    // Update meal to disassociate it from the plan
    await Meal.update(
      { dietPlanId: null },
      { where: { id: mealId } }
    );
    
    res.status(200).send({ message: "Meal removed from diet plan successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
