@echo off
echo Starting NutriBot Application...

echo.
echo Starting Backend API Server...
start cmd /k "cd backend\api && npm run dev"

echo.
echo Starting AI Recommendation Service...
start cmd /k "cd backend\ai-service && python -m pip install --upgrade pip setuptools wheel && python -m pip install -r requirements.txt && python app.py"

echo.
echo Starting Frontend Web Application...
start cmd /k "cd nutri-flow-frontend-main && npm install && npm run dev"

echo.
echo NutriBot application components have been started!
echo.
echo Access the web application at: http://localhost:5173
echo Backend API is running at: http://localhost:5000
echo AI Service is running at: http://localhost:5001
echo.
echo Press any key to stop all services...
pause > nul

echo.
echo Stopping all NutriBot services...
taskkill /F /FI "WINDOWTITLE eq *backend\api*" > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *backend\ai-service*" > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *nutri-flow-frontend-main*" > nul 2>&1
echo All services stopped.
