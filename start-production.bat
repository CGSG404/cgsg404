@echo off
echo Starting CGSG404 in Production Mode...
echo.

echo Step 1: Building application...
call node_modules\.bin\next build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting production server...
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call node_modules\.bin\next start -p 3000
