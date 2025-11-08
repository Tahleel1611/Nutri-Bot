module.exports = {
  secret: process.env.JWT_SECRET || "nutribot-secret-key-change-in-production",
  jwtExpiration: 3600,           // 1 hour
  jwtRefreshExpiration: 86400,   // 24 hours
};
