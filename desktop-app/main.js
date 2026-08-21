const { app, BrowserWindow, dialog } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

let mainWindow;
let mysqlProcess = null;
let nodeProcess = null;

// Konfigurasi path
const XAMPP_MYSQL = 'C:\\xampp\\mysql_start.bat';
const NODE_BACKEND = path.join(__dirname, '../backend/src/server.js');

function startMySQL() {
  console.log('Menjalankan MySQL...');
  exec(`"${XAMPP_MYSQL}"`, { cwd: 'C:\\xampp' }, (err) => {
    if (err) console.error('Gagal menjalankan MySQL:', err);
  });
}

function startBackend() {
  console.log('Menjalankan Backend Node.js...');
  nodeProcess = spawn('node', [NODE_BACKEND], {
    cwd: path.join(__dirname, '../backend'),
    detached: false
  });

  nodeProcess.stdout.on('data', (data) => console.log(`[Backend] ${data}`));
  nodeProcess.stderr.on('data', (data) => console.error(`[Backend Error] ${data}`));
}

function checkServerReady(url, timeout, callback) {
  const startTime = Date.now();
  const interval = setInterval(() => {
    http.get(url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404 || res.statusCode === 302 || res.statusCode === 401) {
        clearInterval(interval);
        callback(true);
      }
    }).on('error', () => {
      if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        callback(false);
      }
    });
  }, 1000);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false, // Jangan tampilkan dulu sampai siap
    icon: path.join(__dirname, '../frontend/assets/logo.png'), // Pastikan punya logo
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Tampilkan loading screen sementara
  mainWindow.loadFile('loading.html');
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.setMenuBarVisibility(false);

  // Tunggu server siap
  checkServerReady('http://localhost:3001/api/health', 15000, (isReady) => {
    if (isReady) {
      console.log('Server siap. Membuka aplikasi...');
      mainWindow.loadURL('http://localhost:3001/');
    } else {
      dialog.showErrorBox(
        'Gagal Memulai Sistem', 
        'Server backend atau database (MySQL) gagal menyala. Pastikan port 3001 dan port 3306 tidak dipakai aplikasi lain, serta XAMPP berada di C:\\xampp.'
      );
      app.quit();
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function stopServices() {
  console.log('Menghentikan layanan...');
  if (nodeProcess) {
    nodeProcess.kill('SIGINT');
  }
  exec('"C:\\xampp\\mysql_stop.bat"', { cwd: 'C:\\xampp' }, (err) => {
    if (err) console.log('Gagal menjalankan mysql_stop.bat:', err);
  });
}

app.on('ready', () => {
  // Matikan sisa mysql (jika ada) baru mulai ulang
  exec('"C:\\xampp\\mysql_stop.bat"', { cwd: 'C:\\xampp' }, () => {
    startMySQL();
    startBackend();
    createWindow();
  });
});

app.on('window-all-closed', function () {
  stopServices();
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  stopServices();
});
