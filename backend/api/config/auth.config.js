module.exports = {
  secret: process.env.JWT_SECRET || "nutribot-secret-key",
  // Token expiration time (24 hours)
  jwtExpiration: 86400,
  // For refresh token
  jwtRefreshExpiration: 604800 // 7 days
};
