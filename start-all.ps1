# NutriBot Service Starter
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    NutriBot - Complete Service Restart   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing processes
Write-Host "[1/4] Stopping existing services..." -ForegroundColor Yellow
Get-Process -Name node,python,python3* -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start API Server
Write-Host "[2/4] Starting API Server (Port 3000)..." -ForegroundColor Yellow
$apiPath = "$PSScriptRoot\backend\api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiPath' ; npm start" -WindowStyle Normal
Start-Sleep -Seconds 5

# Start AI Service
Write-Host "[3/4] Starting AI Service (Port 5001)..." -ForegroundColor Yellow
$aiPath = "$PSScriptRoot\backend\ai-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$aiPath' ; .\.venv\Scripts\python.exe app.py" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[4/4] Starting Frontend (Port 8080)..." -ForegroundColor Yellow
$frontendPath = "$PSScriptRoot\nutri-flow-frontend-main"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath' ; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "All services started!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API Server:  http://localhost:3000" -ForegroundColor White
Write-Host "AI Service:  http://localhost:5001" -ForegroundColor White
Write-Host "Frontend:    http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to check service status..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Checking service status..." -ForegroundColor Yellow
netstat -ano | Select-String ":3000|:5001|:8080"
Write-Host ""
Write-Host "Done! Check the terminal windows above for any errors." -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
