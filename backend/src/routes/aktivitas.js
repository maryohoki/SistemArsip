const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/aktivitas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT aktivitas as text, waktu as time FROM tb_log_aktivitas ORDER BY created_at DESC LIMIT 20');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/aktivitas
router.post('/', async (req, res) => {
  try {
    const { text, time = 'Baru saja' } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text aktivitas diperlukan.' });
    }

    await pool.query('INSERT INTO tb_log_aktivitas (aktivitas, waktu) VALUES (?, ?)', [text, time]);
    
    res.status(201).json({ success: true, data: { text, time } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
