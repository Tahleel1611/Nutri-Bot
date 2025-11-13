<div align="center">

# NutriBot - AI-Powered Nutrition Tracker

A comprehensive nutrition tracking and wellness application with AI-powered meal recommendations, built with Node.js, Python Flask, React, and MySQL.

## 🚀 Quick Start

```powershell
# Start all services at once
.\start-all.ps1
```

Then open your browser to **http://localhost:8080**

## 📋 What's Working

✅ **User Authentication** - Signup, login with JWT tokens  
✅ **Food Logging** - Track meals and nutrition  
✅ **Real-time Dashboard** - Live calorie and macro tracking  
✅ **Database Integration** - MySQL with Sequelize ORM  
✅ **AI Recommendations** - Personalized meal suggestions  
✅ **Responsive UI** - Modern React interface with Tailwind CSS

## 🏗️ Architecture

- **API Server**: Node.js + Express (Port 3000)
- **AI Service**: Python + Flask (Port 5001)
- **Frontend**: React + Vite (Port 8080)
- **Database**: MySQL (nutribot)

## 📖 Documentation

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for:

- Detailed setup instructions
- Configuration options
- API documentation
- Troubleshooting guide

## ⚡ Prerequisites

- Node.js v16+
- Python 3.12
- MySQL Server
- npm package manager

## 🔧 Manual Setup

If you prefer manual control:

```powershell
# Terminal 1 - API Server
cd backend\api
npm install
npm start

# Terminal 2 - AI Service
cd backend\ai-service
.\.venv\Scripts\python.exe app.py

# Terminal 3 - Frontend
cd nutri-flow-frontend-main
npm install
npm run dev
```

## 🌐 Access Points

- Frontend: http://localhost:8080
- API: http://localhost:3000
- AI Service: http://localhost:5001

## ✨ Features

- **Smart Food Logging**: Search and log meals with nutrition data
- **AI Meal Plans**: Get personalized recommendations
- **Progress Tracking**: Monitor calories, macros, and trends
- **User Profiles**: Customizable dietary preferences
- **Real-time Updates**: Instant dashboard refreshes

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing
- CORS protection
- SQL injection prevention (Sequelize ORM)

## 📝 Recent Improvements

- ✅ Fixed port conflicts (moved from 5000 to 3000)
- ✅ Removed all mock data, now 100% real API integration
- ✅ Fixed token storage and authentication flow
- ✅ Improved error handling and logging
- ✅ Created automated startup scripts
- ✅ Comprehensive setup documentation

## 🎯 Project Status

**Status**: ✅ Fully Functional  
**Version**: 2.0  
**Last Updated**: November 13, 2025

All core features are working. The application is ready for use!

---

**Need Help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for troubleshooting and detailed documentation.

**Your AI-Powered Nutrition & Wellness Companion**

[View Demo](#) | [Report Bug](#) | [Request Feature](#)

![NutriBot Dashboard](./screenshots/Screenshot%202025-05-12%20145131.png)

</div>

## ✨ About The Project

NutriBot is an intelligent nutrition and wellness application designed to transform your health journey. Powered by AI, NutriBot creates personalized diet plans, tracks your calorie intake, and recommends nutrient-rich meals tailored to your specific goals and preferences.

### 🌟 Key Features

- **Personalized Meal Plans** - Custom diet plans based on your goals (weight loss, muscle gain, nutrition optimization)
- **Smart Calorie Tracking** - Effortlessly log and monitor your daily calorie intake
- **AI-Powered Recommendations** - Get meal suggestions that match your nutritional needs and preferences
- **Nutrition Insights** - Detailed analysis of your dietary patterns with actionable recommendations
- **Progress Visualization** - Track your journey with intuitive charts and analytics
- **Multiple Diet Types** - Support for various diets including balanced, vegetarian, low-carb, and more

### 📱 Screenshots

<div align="center">

#### Dashboard & Meal Plans

![Dashboard](./screenshots/Screenshot%202025-05-12%20145131.png)

#### Calorie Tracking

![Calorie Tracking](./screenshots/Screenshot%202025-05-12%20145247.png)

#### Nutrition Insights

![Nutrition Insights](./screenshots/Screenshot%202025-05-12%20145352.png)

</div>

## 🛠️ Technology Stack

### Frontend

- **Web Dashboard**: React.js with Shadcn UI components
- **Mobile App**: React Native
- **State Management**: Context API
- **Charts & Visualizations**: Recharts

### Backend

- **Main API**: Node.js + Express
- **Authentication**: JWT
- **AI Recommendation System**: Python Flask microservice
- **Database**: MySQL

## 🚀 Getting Started

### Prerequisites

Before running NutriBot, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.12 or higher) - [Download here](https://python.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)

### Quick Setup

1. **Clone the repository** (if not already done)

   ```bash
   git clone https://github.com/yourusername/nutribot.git
   cd nutribot
   ```

2. **Install Dependencies**

   Run the setup script to install all dependencies:

   ```bash
   setup.bat
   ```

   This will automatically:

   - Install all Node.js dependencies for API and frontend
   - Create Python virtual environment
   - Install Python dependencies for AI service
   - Create sample food database

3. **Set up your MySQL database**

   - Make sure MySQL is running (check services or run `net start MySQL80`)
   - Create a database named `nutribot`:
     ```sql
     CREATE DATABASE nutribot;
     ```
   - Update the database credentials in `backend/api/.env` if needed (default is root/root)

4. **Start the application**

   Use the all-in-one startup script:

   ```bash
   start-all.bat
   ```

   This will start all three services in separate windows:

   - AI Service (Port 5001)
   - API Server (Port 5000)
   - Frontend (Port 8080)

   Or start services individually:

   ```bash
   start-ai-service.bat    # AI Service only
   start-api.bat           # API Server only
   start-frontend.bat      # Frontend only
   ```

### Manual Setup

If you prefer to set up manually:

#### Backend API Setup

```bash
cd backend/api
npm install
# Make sure your .env file has the correct database credentials
npm run dev
```

#### AI Service Setup

```bash
cd backend/ai-service
pip install -r requirements.txt
python app.py
```

#### Frontend Setup

```bash
cd nutri-flow-frontend-main
npm install
npm run dev
```

### Environment Configuration

#### Backend API (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nutribot_db
JWT_SECRET=nutribot-secret-key-for-development
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:5001/api
```

### Accessing the Application

Once all services are running:

- **Web Application**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:5001

### Database Schema

The application will automatically create the following tables:

- `users` - User accounts and authentication
- `profiles` - User profile information (age, weight, goals, etc.)
- `dietPlans` - User's diet plans
- `meals` - Meal information and recipes
- `nutrientLogs` - Daily nutrition tracking data

### Troubleshooting

**Common Issues:**

1. **Database Connection Error**

   - Make sure MySQL is running: `net start MySQL80` (Windows) or check services
   - Check your database credentials in `backend/api/.env`
   - Ensure the database `nutribot` exists: `CREATE DATABASE nutribot;`
   - Default credentials are root/root - update if your MySQL uses different credentials

2. **Port Already in Use**

   - Make sure ports 5000, 5001, and 8080 are available
   - Close any other applications using these ports
   - Check running processes: `netstat -ano | findstr :5000`

3. **Python Dependencies Error**

   - Make sure Python 3.12+ is installed and added to PATH
   - The project uses a virtual environment in `.venv` folder
   - Try reinstalling: Delete `.venv` folder and run `setup.bat` again
   - If numpy/pandas fail, they require Python 3.12 - older versions won't work

4. **Node.js Dependencies Error**

   - Clear node_modules and reinstall:
     ```bash
     cd backend/api
     rm -rf node_modules package-lock.json
     npm install
     ```
   - Do the same for frontend if needed

5. **AI Service Won't Start**

   - Check if all Python packages are installed in the virtual environment
   - Run: `C:/Users/YOUR_USER/OneDrive/Documents/NutriBot/.venv/Scripts/python.exe -m pip list`
   - Should see: flask, flask-cors, numpy, pandas, scikit-learn
   - If missing, run `setup.bat` again

6. **Frontend Shows API Errors**
   - Make sure both backend services are running (ports 5000 and 5001)
   - Check `.env` file in `nutri-flow-frontend-main` has correct URLs
   - Open browser console (F12) to see detailed error messages

**Still Having Issues?**

Check the terminal windows for detailed error messages. Each service runs in its own window showing real-time logs.

### Development

#### API Endpoints

**Authentication:**

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/refreshtoken` - Refresh access token

**User Management:**

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

**Meals:**

- `GET /api/meals` - Get all meals
- `POST /api/meals` - Create new meal
- `GET /api/meals/:id` - Get specific meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

**Diet Plans:**

- `GET /api/plans` - Get user's diet plans
- `POST /api/plans` - Create new diet plan
- `POST /api/plans/generate` - Generate AI diet plan
- `GET /api/plans/:id` - Get specific diet plan
- `PUT /api/plans/:id` - Update diet plan
- `DELETE /api/plans/:id` - Delete diet plan

**AI Services:**

- `POST /api/recommend/meals` - Get meal recommendations
- `POST /api/generate/diet-plan` - Generate complete diet plan
- `POST /api/generate/meal-prep` - Generate meal prep plan

## 🔍 Features In Detail

### Personalized Meal Plans

NutriBot offers multiple meal plan options including weight loss, muscle building, balanced nutrition, and vegetarian plans. Each plan includes detailed daily meal breakdowns with calorie targets and nutritional information.

### Calorie & Nutrient Tracking

Easily log your meals and track your daily calorie intake. NutriBot provides a comprehensive food database and remembers your frequently logged items for quick access.

### Nutrition Insights

Get detailed analysis of your dietary patterns, including macronutrient distribution, calorie intake trends, and nutrient analysis with personalized recommendations for addressing deficiencies.

### User Profiles & Goals

Set your health goals, dietary preferences, and track your progress over time. NutriBot adapts its recommendations based on your evolving needs and preferences.
