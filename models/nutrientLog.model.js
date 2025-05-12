module.exports = (sequelize, Sequelize) => {
  const NutrientLog = sequelize.define("nutrientLog", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    mealId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'meals',
        key: 'id'
      }
    },
    foodName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    servingSize: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    servingUnit: {
      type: Sequelize.STRING,
      allowNull: false
    },
    calories: {
      type: Sequelize.FLOAT
    },
    protein: {
      type: Sequelize.FLOAT
    },
    carbs: {
      type: Sequelize.FLOAT
    },
    fat: {
      type: Sequelize.FLOAT
    },
    fiber: {
      type: Sequelize.FLOAT
    },
    sugar: {
      type: Sequelize.FLOAT
    },
    sodium: {
      type: Sequelize.FLOAT
    },
    cholesterol: {
      type: Sequelize.FLOAT
    },
    vitamins: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    minerals: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    mealType: {
      type: Sequelize.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: false
    },
    notes: {
      type: Sequelize.TEXT
    }
  }, {
    timestamps: true
  });

  return NutrientLog;
};
