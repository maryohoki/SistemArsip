@echo off
title Sistem Pengarsipan Desa Tanjungsari - Fullstack
echo.
echo  =====================================================
echo   MEMULAI APLIKASI FULLSTACK
echo   Backend  : http://localhost:3001/api
echo   Frontend : http://localhost:8080
echo  =====================================================
echo.

echo [1/2] Memulai Backend API di port 3001...
start "Backend API - Port 3001" cmd /k "cd /d "%~dp0backend" && node src/server.js"

echo [2/2] Menunggu 3 detik lalu memulai Frontend...
timeout /t 3 /nobreak >nul

start "Frontend - Port 8080" cmd /k "cd /d "%~dp0frontend" && node server.js"

echo.
echo  Kedua server sudah berjalan!
echo  Buka browser di: http://localhost:8080
echo.
timeout /t 4 /nobreak >nul
start "" "http://localhost:8080"
