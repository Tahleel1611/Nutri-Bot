module.exports = (sequelize, Sequelize) => {
  const WaterIntake = sequelize.define("waterIntake", {
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
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 10000 // Max 10 liters per entry (safety check)
      }
    },
    unit: {
      type: Sequelize.ENUM('ml', 'oz', 'cups', 'liters'),
      defaultValue: 'ml'
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    notes: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return WaterIntake;
};
