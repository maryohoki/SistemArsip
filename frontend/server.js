/**
 * server.js — Static File Server untuk Frontend
 * Melayani file HTML/CSS/JS dari folder frontend/ di port 8080
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname; // folder frontend/

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
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // Keamanan: cegah path traversal
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
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
  console.log('='.repeat(50));
  console.log('  FRONTEND SERVER — Desa Tanjungsari');
  console.log(`  Buka browser: http://localhost:${PORT}/`);
  console.log('  Tekan Ctrl+C untuk stop.');
  console.log('='.repeat(50));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`ERROR: Port ${PORT} sudah digunakan.`);
  } else {
    console.error('ERROR:', err.message);
  }
  process.exit(1);
});
