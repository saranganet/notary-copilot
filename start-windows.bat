@echo off
title Mom's Digital Notary Desk
echo ========================================================
echo       STARTING DIGITAL NOTARY DESK FOR MOM (WINDOWS)
echo ========================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this PC.
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if node_modules does not exist
if not exist "node_modules\" (
    echo [INFO] Installing required packages for first-time setup...
    call npm install
)

:: Launch Vite Dev Server and open browser
echo [INFO] Starting local Notary Desk server...
start http://localhost:5173/
call npm run dev

pause
