module.exports = (sequelize, Sequelize) => {
  const HabitGoal = sequelize.define("habitGoal", {
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
    goalType: {
      type: Sequelize.ENUM('water', 'calories', 'protein', 'carbs', 'fat'),
      allowNull: false
    },
    targetValue: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    unit: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'ml' // ml for water, g for macros, kcal for calories
    },
    currentStreak: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    longestStreak: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    lastCompletedDate: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    reminderTimes: {
      type: Sequelize.JSON, // Array of time strings like ["08:00", "12:00", "18:00"]
      defaultValue: []
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'goalType']
      }
    ]
  });

  return HabitGoal;
};
