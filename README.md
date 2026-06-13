# NutriBot - AI-Powered Nutrition & Wellness Application

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](https://github.com/Tahleel1611/Nutri-Bot)

> **Recent Updates**: NutriBot has been completely overhauled with professional backend infrastructure, comprehensive documentation, and security enhancements. See [IMPROVEMENTS.md](IMPROVEMENTS.md) for details.

## Overview

NutriBot is a comprehensive nutrition and wellness application that helps users track their dietary intake, generate personalized meal plans, and achieve their health goals. The application combines a modern React frontend with a robust Node.js backend and Python-based AI recommendation service.

## Features and Functionalities

### Core Functionality
- 🍽️ **Meal Planning** - Create and manage personalized diet plans
- 📊 **Calorie Tracking** - Log daily meals and track nutritional intake
- 🎯 **Goal Setting** - Set and monitor fitness goals (weight loss, maintenance, muscle gain)
- 🤖 **AI Recommendations** - Get AI-powered meal suggestions based on your profile
- 📈 **Nutrition Insights** - Visualize nutritional data and progress
- 👤 **User Profiles** - Manage personal information and dietary preferences
- 🔒 **Secure Authentication** - JWT-based authentication with rate limiting

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT-based authentication with refresh tokens
- ✅ MySQL database with Sequelize ORM
- ✅ Flask-based AI recommendation engine
- ✅ Responsive React UI with TailwindCSS
- ✅ Comprehensive error handling and validation
- ✅ Rate limiting for security
- ✅ Health check endpoints for monitoring
- ✅ Structured logging
- ✅ Environment validation
- ✅ Production-ready deployment configurations

## Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **TailwindCSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **shadcn/ui** component library

### Backend (Node.js API)
- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Validator** - Input validation

### AI Service (Python)
- **Flask** - Web framework
- **NumPy** - Numerical computations
- **Pandas** - Data manipulation
- **scikit-learn** - Machine learning capabilities

## Quick Start

### Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Tahleel1611/Nutri-Bot.git
cd Nutri-Bot

# Run the setup script
./setup.sh

# Edit .env file with your configuration
nano .env

# Create database
mysql -u root -p -e "CREATE DATABASE nutribot"

# Start services
npm start                # Node.js API (Terminal 1)
python3 app.py          # Python AI Service (Terminal 2)
```

### Manual Setup

See detailed instructions below.

### Prerequisites
- Node.js 14+ 
- Python 3.10+
- MySQL 5.7+ or MariaDB
- npm or yarn package manager
- pip package manager

### Clone Repository
```bash
git clone https://github.com/Tahleel1611/Nutri-Bot.git
cd Nutri-Bot
```

### Backend Setup (Node.js)

1. Install Node dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nutribot

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# AI Service URL
AI_SERVICE_URL=http://localhost:5001
```

3. Create MySQL database:
```sql
CREATE DATABASE nutribot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Start the Node.js server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The API server will start on `http://localhost:5000`

### AI Service Setup (Python)

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Update `.env` file with AI service configuration:
```env
# Add to existing .env
PORT=5001
```

3. Start the Python AI service:
```bash
python app.py
```

The AI service will start on `http://localhost:5001`

### Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Update `.env` with API URLs:
```env
VITE_API_URL=http://localhost:5000/api/
VITE_AI_SERVICE_URL=http://localhost:5001/api/
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

#### POST `/api/auth/signin`
Login user
```json
{
  "email": "string",
  "password": "string"
}
```

#### POST `/api/auth/refreshtoken`
Refresh access token
```json
{
  "refreshToken": "string"
}
```

### User Endpoints

#### GET `/api/users/profile`
Get user profile (requires authentication)

#### PUT `/api/users/profile`
Update user profile (requires authentication)
```json
{
  "age": 30,
  "gender": "male",
  "weight": 75,
  "height": 175,
  "activityLevel": "moderate",
  "goal": "weight_loss",
  "dietaryRestrictions": [],
  "allergies": []
}
```

### Meal Endpoints

#### GET `/api/meals`
Get all meals for authenticated user

#### POST `/api/meals`
Create a new meal
```json
{
  "name": "string",
  "calories": 500,
  "protein": 30,
  "carbs": 50,
  "fat": 15,
  "mealType": "lunch"
}
```

### Diet Plan Endpoints

#### GET `/api/plans`
Get all diet plans

#### POST `/api/plans/generate`
Generate AI-powered diet plan
```json
{
  "duration": 7
}
```

### AI Service Endpoints

#### POST `/api/recommend/meals`
Get meal recommendations
```json
{
  "profile": {
    "age": 30,
    "gender": "male",
    "weight": 75,
    "height": 175,
    "activityLevel": "moderate",
    "goal": "weight_loss"
  }
}
```

## Project Structure

```
Nutri-Bot/
├── config/              # Configuration files
│   ├── auth.config.js
│   └── db.config.js
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── meal.controller.js
│   ├── plan.controller.js
│   └── user.controller.js
├── middleware/          # Express middleware
│   └── auth.middleware.js
├── models/             # Database models
│   ├── user.model.js
│   ├── profile.model.js
│   ├── meal.model.js
│   ├── dietPlan.model.js
│   └── nutrientLog.model.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── meal.routes.js
│   ├── plan.routes.js
│   └── user.routes.js
├── src/               # Frontend source
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── utils/
├── data/              # Data files
│   └── food_database.json
├── app.py            # Python AI service
├── server.js         # Node.js server
├── package.json      # Node dependencies
└── requirements.txt  # Python dependencies
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files. Always use environment variables for sensitive data.
2. **JWT Secret**: Change the default JWT secret in production (min 32 characters).
3. **Password Security**: Passwords are hashed using bcryptjs with 8 salt rounds.
4. **Input Validation**: All user inputs are validated before processing.
5. **Rate Limiting**: Authentication endpoints are rate-limited (5 req/15 min).
6. **CORS**: Configure CORS properly for production deployments.
7. **Error Messages**: Stack traces are hidden in production.

## Testing

### Smoke Tests

Run basic functionality tests:

```bash
# Make sure services are running first
./test-smoke.sh
```

### Manual Testing

```bash
# Test Node.js API health
curl http://localhost:5000/health

# Test Python AI service health
curl http://localhost:5001/health
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Deployment

### Environment Variables for Production
Ensure all environment variables are properly set:
- Use strong JWT secrets
- Configure database connection strings
- Set NODE_ENV to 'production'
- Configure proper CORS origins

### Database Migrations
Make sure to run database migrations before deploying:
```bash
# Sequelize will auto-sync in development
# For production, use migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

**Port Already in Use**
- Change PORT in `.env` file
- Kill process using the port: `lsof -ti:5000 | xargs kill`

**Python Dependencies Issues**
- Ensure Python 3.10+ is installed
- Try upgrading pip: `pip install --upgrade pip`
- Use virtual environment: `python -m venv venv`

## License

ISC License - see LICENSE file for details

## Support

For support, email support@nutribot.com or open an issue on GitHub.

## Acknowledgments

- React and the React team
- Express.js community
- Flask framework
- All open-source contributors

---

**Note**: This is a demo application. For production use, implement additional security measures, comprehensive testing, and proper error monitoring.
