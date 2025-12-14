const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.profile = require("./profile.model.js")(sequelize, Sequelize);
db.meal = require("./meal.model.js")(sequelize, Sequelize);
db.dietPlan = require("./dietPlan.model.js")(sequelize, Sequelize);
db.nutrientLog = require("./nutrientLog.model.js")(sequelize, Sequelize);
db.waterIntake = require("./waterIntake.model.js")(sequelize, Sequelize);

// Define relationships
db.user.hasOne(db.profile, {
  foreignKey: "userId",
  as: "profile"
});
db.profile.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

db.user.hasMany(db.dietPlan, {
  foreignKey: "userId",
  as: "dietPlans"
});
db.dietPlan.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

db.user.hasMany(db.nutrientLog, {
  foreignKey: "userId",
  as: "nutrientLogs"
});
db.nutrientLog.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

db.user.hasMany(db.meal, {
  foreignKey: "userId",
  as: "meals"
});
db.meal.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

db.dietPlan.hasMany(db.meal, {
  foreignKey: "dietPlanId",
  as: "meals"
});
db.meal.belongsTo(db.dietPlan, {
  foreignKey: "dietPlanId",
  as: "dietPlan"
});

db.user.hasMany(db.waterIntake, {
  foreignKey: "userId",
  as: "waterIntakes"
});
db.waterIntake.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

module.exports = db;
