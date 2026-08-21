@echo off
title Sistem Pengarsipan Desa Tanjungsari
color 0A
echo.
echo  ============================================================
echo    SISTEM PENGARSIPAN ADMINISTRASI DESA TANJUNGSARI
echo  ============================================================
echo.

:: Matikan proses node lama dulu (kalau ada)
echo  [*] Membersihkan proses node lama...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

:: Cek apakah node ada
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js tidak ditemukan! Silakan install Node.js dari https://nodejs.org
    pause
    exit /b 1
)

:: Jalankan Backend (port 3001) di window terpisah
echo  [1/2] Memulai Backend API (port 3001)...
start "BACKEND - Port 3001" cmd /k "cd /d ""%~dp0backend"" && echo Backend siap... && node src/server.js"

:: Tunggu backend siap
echo  [*] Menunggu backend siap (3 detik)...
timeout /t 3 /nobreak >nul

:: Jalankan Frontend (port 8080) di window terpisah
echo  [2/2] Memulai Frontend Server (port 8080)...
start "FRONTEND - Port 8080" cmd /k "cd /d ""%~dp0frontend"" && node server.js"

:: Tunggu sebentar lalu buka browser
echo  [*] Menunggu server siap (3 detik)...
timeout /t 3 /nobreak >nul

echo.
echo  ============================================================
echo    Berhasil! Membuka browser di http://localhost:8080
echo  ============================================================
echo.

start "" "http://localhost:8080"
