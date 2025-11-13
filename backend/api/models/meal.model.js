module.exports = (sequelize, Sequelize) => {
  const Meal = sequelize.define("meal", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    dietPlanId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'dietPlans',
        key: 'id'
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: false
    },
    calories: {
      type: Sequelize.FLOAT
    },
    protein: {
      type: Sequelize.FLOAT,
      comment: 'Protein in grams'
    },
    carbs: {
      type: Sequelize.FLOAT,
      comment: 'Carbohydrates in grams'
    },
    fat: {
      type: Sequelize.FLOAT,
      comment: 'Fat in grams'
    },
    fiber: {
      type: Sequelize.FLOAT,
      comment: 'Fiber in grams'
    },
    sugar: {
      type: Sequelize.FLOAT,
      comment: 'Sugar in grams'
    },
    ingredients: {
      type: Sequelize.JSON
    },
    instructions: {
      type: Sequelize.TEXT
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    prepTime: {
      type: Sequelize.INTEGER,
      comment: 'Preparation time in minutes'
    },
    cookTime: {
      type: Sequelize.INTEGER,
      comment: 'Cooking time in minutes'
    },
    servings: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    isRecommended: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  return Meal;
};
