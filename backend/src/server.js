/**
 * server.js — Express Backend Entry Point
 * Sistem Pengarsipan Administrasi Desa Tanjungsari
 *
 * Port: 3001
 * Base URL: http://localhost:3001/api
 *
 * Routes:
 *   /api/arsip        — CRUD arsip surat
 *   /api/settings     — Pengaturan profil desa
 *   /api/aktivitas    — Log aktivitas sistem
 *   /api/jenis-surat  — Katalog jenis surat & custom templates
 */

const express = require('express');
const cors = require('cors');

const arsipRoutes    = require('./routes/arsip');
const settingsRoutes = require('./routes/settings');
const aktivitasRoutes= require('./routes/aktivitas');
const jenisRoutes    = require('./routes/jenis');
const agendaRoutes   = require('./routes/agenda');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
// CORS: izinkan frontend (port 8080) mengakses BE (port 3001)
app.use(cors({
  origin: [
    'http://localhost:8080', 'http://127.0.0.1:8080',
    'http://localhost', 'http://localhost:80',
    'http://127.0.0.1', 'http://127.0.0.1:80'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON body
app.use(express.json({ limit: '2mb' }));

// Request logger (simple)
app.use((req, _res, next) => {
  const ts = new Date().toLocaleTimeString('id-ID');
  console.log(`[${ts}] ${req.method} ${req.path}`);
  next();
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/arsip',       arsipRoutes);
app.use('/api/settings',    settingsRoutes);
app.use('/api/aktivitas',   aktivitasRoutes);
app.use('/api/jenis-surat', jenisRoutes);
app.use('/api/agenda',      agendaRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    app: 'Pengarsipan Desa Tanjungsari — Backend API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ success: false, message: 'Internal Server Error: ' + err.message });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(52));
  console.log('  BACKEND API — Desa Tanjungsari');
  console.log(`  Berjalan di: http://localhost:${PORT}/api`);
  console.log('  Endpoints tersedia:');
  console.log(`    GET/POST   http://localhost:${PORT}/api/arsip`);
  console.log(`    GET/PUT    http://localhost:${PORT}/api/settings`);
  console.log(`    GET/POST   http://localhost:${PORT}/api/aktivitas`);
  console.log(`    GET/POST   http://localhost:${PORT}/api/jenis-surat`);
  console.log(`    GET        http://localhost:${PORT}/api/health`);
  console.log('  Tekan Ctrl+C untuk stop.');
  console.log('='.repeat(52));
});

module.exports = app;
