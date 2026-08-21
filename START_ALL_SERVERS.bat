@echo off
title KiranaStore - Start All Servers
color 0A

echo ===============================================================================
echo                KIRANASTORE 10-MINUTE QUICK-COMMERCE PLATFORM
echo                     Developed by Akarshan Mishra
echo ===============================================================================
echo.
echo  [1/3] Starting FastAPI Backend (Port 8000)...
start "Kirana Backend (Port 8000)" cmd /k "color 0B && cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo  [2/3] Starting Customer Web & Mobile App (Port 3000)...
start "Kirana Customer App (Port 3000)" cmd /k "color 0A && cd /d %~dp0frontend && npm run dev -- --host 0.0.0.0 --port 3000"

timeout /t 2 /nobreak >nul

echo  [3/3] Starting Admin Operations Portal (Port 3001)...
start "Kirana Admin Portal (Port 3001)" cmd /k "color 0D && cd /d %~dp0admin && npm run dev -- --host 0.0.0.0 --port 3001"

timeout /t 3 /nobreak >nul

echo.
echo ===============================================================================
echo   ALL SERVERS ARE RUNNING IN BACKGROUND WINDOWS!
echo ===============================================================================
echo.
echo   * Customer App:   http://localhost:3000
echo   * Admin Portal:   http://localhost:3001
echo   * Backend Docs:   http://localhost:8000/docs
echo.
echo   Opening Customer App and Admin Portal in your default browser...
echo.
start http://localhost:3000
start http://localhost:3001

echo Press any key to exit this launcher (Servers will keep running)...
pause >nul
