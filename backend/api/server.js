require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require('./models');

// Sync database
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Database dropped and recreated successfully.");
  })
  .catch((err) => {
    console.log("Failed to sync database: " + err.message);
  });

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mealRoutes = require('./routes/meal.routes');
const planRoutes = require('./routes/plan.routes');
const nutrientRoutes = require('./routes/nutrient.routes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/nutrients', nutrientRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NutriBot API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
console.log('Attempting to start server on port:', PORT);
console.log('Binding to: 127.0.0.1');

const server = app.listen(PORT, '127.0.0.1', () => {
  const address = server.address();
  console.log(`========================================`);
  console.log(`✅ Server is running successfully!`);
  console.log(`Port: ${address.port}`);
  console.log(`Address: ${address.address}`);
  console.log(`API available at http://127.0.0.1:${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`========================================`);
});

server.on('listening', () => {
  console.log('✅ Server is now listening for connections');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

// For testing
module.exports = app;
