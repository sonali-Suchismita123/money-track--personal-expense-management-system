@echo off
title MoneyTrack Launcher
echo ========================================================
echo        Starting MoneyTrack (Personal Finance App)
echo ========================================================
echo.

set PY_CMD=python
python3.12 --version >nul 2>&1 && set PY_CMD=python3.12

echo 1. Launching Backend & Unified App on http://127.0.0.1:5001 ...
start "MoneyTrack Backend" cmd /k "cd /d "%~dp0backend" && %PY_CMD% app.py"

timeout /t 3 /nobreak >nul

echo 2. Launching React Dev Server on http://127.0.0.1:3000 ...
start "MoneyTrack Frontend" cmd /k "cd /d "%~dp0frontend" && call npm start"

timeout /t 6 /nobreak >nul

echo 3. Opening Application in Browser ...
start http://127.0.0.1:5001

echo.
echo ========================================================
echo   MoneyTrack is running!
echo   Main App (Unified):  http://localhost:5001
echo   Alt / Dev Server:    http://localhost:3000
echo   API Health:          http://localhost:5001/api/health
echo   Demo Login: demo@moneytrack.com / Demo@123
echo ========================================================
