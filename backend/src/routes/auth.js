const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { verifyAdmin } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'tanjungsari_desa_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Rate Limiter untuk mencegah brute force pada login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 5, // limit setiap IP maksimal 5 request per windowMs
  message: { success: false, message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 5 menit.' }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    }

    const cleanUsername = validator.escape(validator.trim(username));

    const [rows] = await pool.query('SELECT * FROM tb_users WHERE username = ? AND is_active = 1', [cleanUsername]);
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    // Update last login
    await pool.query('UPDATE tb_users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Generate JWT
    const payload = {
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      success: true,
      message: 'Login berhasil.',
      token: token,
      user: payload
    });

  } catch (err) {
    console.error('[AUTH ERROR]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
});

// POST /api/auth/register (Hanya admin yang bisa membuatkan akun)
router.post('/register', verifyAdmin, async (req, res) => {
  try {
    const { username, password, nama_lengkap, role } = req.body;

    if (!username || !password || !nama_lengkap) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password minimal 8 karakter.' });
    }

    const cleanUsername = validator.escape(validator.trim(username));
    const cleanNama = validator.escape(validator.trim(nama_lengkap));
    const assignedRole = (role === 'admin') ? 'admin' : 'petugas';

    // Cek username terpakai
    const [existing] = await pool.query('SELECT id FROM tb_users WHERE username = ?', [cleanUsername]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO tb_users (username, password, nama_lengkap, role) VALUES (?, ?, ?, ?)',
      [cleanUsername, hash, cleanNama, assignedRole]
    );

    res.json({ success: true, message: 'Akun petugas berhasil dibuat.' });

  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;
