@echo off
echo ========================================
echo   Starting Synapse AI Dashboard
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/2] Setting up Frontend...
cd frontend

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing Node modules...
    call npm install
)

echo.
echo [2/2] Starting Frontend...
echo.

REM Start Frontend
start "Synapse Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Synapse Dashboard Started!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo.
echo IMPORTANT: Make sure your backend is running
echo and configured in frontend\.env
echo.
echo Press any key to open the dashboard...
pause >nul

start http://localhost:3000

echo.
echo Dashboard is running!
echo Close the terminal window to stop.
echo.
pause
