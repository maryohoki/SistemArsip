@echo off
title Pengarsipan Desa Tanjungsari
color 0A
echo.
echo  ============================================================
echo    SISTEM PENGARSIPAN ADMINISTRASI DESA TANJUNGSARI
echo  ============================================================
echo.

:: Matikan proses node lama dulu (kalau ada)
echo  [*] Membersihkan proses lama...
taskkill /F /IM node.exe >nul 2>&1

timeout /t 1 /nobreak >nul

:: Jalankan Backend (port 3001)
echo  [1/2] Memulai Backend API (port 3001)...
start "BACKEND - Port 3001" /D "%~dp0backend" cmd /k "node src/server.js"

:: Tunggu backend siap
echo  [*] Menunggu backend siap (3 detik)...
timeout /t 3 /nobreak >nul

:: Jalankan Frontend (port 8080)
echo  [2/2] Memulai Frontend (port 8080)...
start "FRONTEND - Port 8080" /D "%~dp0frontend" cmd /k "node server.js"

:: Tunggu frontend siap lalu buka browser
echo  [*] Menunggu frontend siap (3 detik)...
timeout /t 3 /nobreak >nul

echo.
echo  ============================================================
echo    Berhasil! Membuka browser...
echo    URL: http://localhost:8080
echo  ============================================================
echo.

start "" http://localhost:8080
