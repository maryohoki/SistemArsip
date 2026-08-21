const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.htm':  'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // Keamanan: hindari path traversal
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - File Not Found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('==================================================');
  console.log('  Server Berhasil Dijalankan!');
  console.log('  Akses Web di: http://localhost:' + PORT + '/');
  console.log('  Tekan Ctrl+C untuk stop.');
  console.log('==================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('ERROR: Port ' + PORT + ' sudah digunakan. Tutup aplikasi lain yang memakai port ini.');
  } else {
    console.error('ERROR:', err.message);
  }
  process.exit(1);
});
