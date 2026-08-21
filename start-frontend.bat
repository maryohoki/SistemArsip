@echo off
title Frontend - Pengarsipan Desa Tanjungsari (Port 8080)
color 0B
echo.
echo  =====================================================
echo   FRONTEND - Sistem Pengarsipan Desa Tanjungsari
echo   Buka browser: http://localhost:8080
echo  =====================================================
echo.
cd /d "%~dp0frontend"
node server.js
pause
