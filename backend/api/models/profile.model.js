module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define("profile", {
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
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    age: {
      type: Sequelize.INTEGER
    },
    gender: {
      type: Sequelize.ENUM('male', 'female', 'other')
    },
    height: {
      type: Sequelize.FLOAT,
      comment: 'Height in cm'
    },
    weight: {
      type: Sequelize.FLOAT,
      comment: 'Weight in kg'
    },
    goalWeight: {
      type: Sequelize.FLOAT,
      comment: 'Goal weight in kg'
    },
    activityLevel: {
      type: Sequelize.ENUM('sedentary', 'light', 'moderate', 'active', 'very_active'),
      defaultValue: 'moderate'
    },
    goal: {
      type: Sequelize.ENUM('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain'),
      defaultValue: 'maintenance'
    },
    dietaryRestrictions: {
      type: Sequelize.JSON,
      defaultValue: []
    },
    allergies: {
      type: Sequelize.JSON,
      defaultValue: []
    },
    medicalConditions: {
      type: Sequelize.JSON,
      defaultValue: []
    }
  }, {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Profile;
};
