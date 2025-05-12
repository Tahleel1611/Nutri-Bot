const express = require("express");
const router = express.Router();
const planController = require("../controllers/plan.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(verifyToken);

// Diet plan routes
router.get("/", planController.getUserPlans);
router.get("/:id", planController.getPlanById);
router.post("/", planController.createPlan);
router.put("/:id", planController.updatePlan);
router.delete("/:id", planController.deletePlan);
router.post("/generate", planController.generateAiPlan);
router.post("/:id/meals/:mealId", planController.addMealToPlan);
router.delete("/:id/meals/:mealId", planController.removeMealFromPlan);

module.exports = router;
