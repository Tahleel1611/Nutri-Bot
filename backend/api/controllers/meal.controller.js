const db = require("../models");
const Meal = db.meal;
const DietPlan = db.dietPlan;

// Get all meals
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.findAll({
      where: {
        dietPlanId: null // Get only general meals, not tied to a specific diet plan
      }
    });
    res.status(200).send(meals);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    
    if (!meal) {
      return res.status(404).send({ message: "Meal not found." });
    }
    
    res.status(200).send(meal);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a new meal
exports.createMeal = async (req, res) => {
  try {
    // Create meal
    const meal = await Meal.create({
      ...req.body
    });
    
    res.status(201).send(meal);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a meal
exports.updateMeal = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if meal exists and belongs to a diet plan owned by the user
    const meal = await Meal.findByPk(id, {
      include: [{
        model: DietPlan,
        as: "dietPlan",
        where: { userId: req.userId },
        required: false
      }]
    });
    
    if (!meal) {
      return res.status(404).send({ message: "Meal not found." });
    }
    
    // If meal belongs to a diet plan, check if the diet plan belongs to the user
    if (meal.dietPlanId && (!meal.dietPlan || meal.dietPlan.userId !== req.userId)) {
      return res.status(403).send({ message: "You don't have permission to update this meal." });
    }
    
    // Update meal
    await Meal.update(req.body, {
      where: { id: id }
    });
    
    res.status(200).send({ message: "Meal updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a meal
exports.deleteMeal = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if meal exists and belongs to a diet plan owned by the user
    const meal = await Meal.findByPk(id, {
      include: [{
        model: DietPlan,
        as: "dietPlan",
        where: { userId: req.userId },
        required: false
      }]
    });
    
    if (!meal) {
      return res.status(404).send({ message: "Meal not found." });
    }
    
    // If meal belongs to a diet plan, check if the diet plan belongs to the user
    if (meal.dietPlanId && (!meal.dietPlan || meal.dietPlan.userId !== req.userId)) {
      return res.status(403).send({ message: "You don't have permission to delete this meal." });
    }
    
    // Delete meal
    await Meal.destroy({
      where: { id: id }
    });
    
    res.status(200).send({ message: "Meal deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get recommended meals based on user profile
exports.getRecommendedMeals = async (req, res) => {
  try {
    // In a real application, this would call the AI service to get personalized recommendations
    // For now, we'll just return meals marked as recommended
    const meals = await Meal.findAll({
      where: {
        isRecommended: true
      },
      limit: 10
    });
    
    res.status(200).send(meals);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
