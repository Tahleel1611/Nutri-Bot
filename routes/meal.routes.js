const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(verifyToken);

// Meal routes
router.get("/", mealController.getAllMeals);
router.get("/recommended", mealController.getRecommendedMeals);
router.get("/:id", mealController.getMealById);
router.post("/", mealController.createMeal);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

module.exports = router;
