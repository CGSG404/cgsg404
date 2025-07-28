@echo off
echo 🔧 FIXING PORT 3000 ISSUE
echo =========================
echo.

echo 🔍 Checking what's using port 3000...
netstat -ano | findstr :3000

echo.
echo 🛑 Killing all Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo.
echo ⏳ Waiting for processes to close...
timeout /t 3 /nobreak >nul

echo.
echo 🔍 Checking port 3000 again...
netstat -ano | findstr :3000

echo.
echo 🚀 Starting development server...
echo ================================
npm run dev
