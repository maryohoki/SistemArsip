@echo off
title Backend API - Pengarsipan Desa Tanjungsari (Port 3001)
color 0A
echo.
echo  =====================================================
echo   BACKEND API - Sistem Pengarsipan Desa Tanjungsari
echo   Port: http://localhost:3001/api
echo  =====================================================
echo.
cd /d "%~dp0backend"
node src/server.js
pause
