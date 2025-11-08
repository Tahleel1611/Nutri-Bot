module.exports = (sequelize, Sequelize) => {
  const DietPlan = sequelize.define("dietPlan", {
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
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    goal: {
      type: Sequelize.ENUM('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain'),
      allowNull: false
    },
    dailyCalories: {
      type: Sequelize.INTEGER
    },
    dailyProtein: {
      type: Sequelize.FLOAT,
      comment: 'Protein in grams'
    },
    dailyCarbs: {
      type: Sequelize.FLOAT,
      comment: 'Carbohydrates in grams'
    },
    dailyFat: {
      type: Sequelize.FLOAT,
      comment: 'Fat in grams'
    },
    startDate: {
      type: Sequelize.DATEONLY
    },
    endDate: {
      type: Sequelize.DATEONLY
    },
    duration: {
      type: Sequelize.INTEGER,
      comment: 'Duration in days',
      defaultValue: 7
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    isAiGenerated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    aiGenerationParams: {
      type: Sequelize.JSON,
      comment: 'Parameters used for AI generation'
    }
  }, {
    timestamps: true
  });

  return DietPlan;
};
