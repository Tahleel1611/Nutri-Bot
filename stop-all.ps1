# NutriBot Service Stopper
Write-Host "==========================================" -ForegroundColor Red
Write-Host "    Stopping All NutriBot Services       " -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red
Write-Host ""

Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Node.js processes stopped" -ForegroundColor Green

Write-Host "Stopping Python processes..." -ForegroundColor Yellow
Get-Process -Name python,python3* -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Python processes stopped" -ForegroundColor Green

Write-Host ""
Write-Host "All services stopped!" -ForegroundColor Green
Write-Host ""
