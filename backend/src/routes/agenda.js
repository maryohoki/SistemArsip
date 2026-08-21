const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/agenda
router.post('/', async (req, res) => {
  try {
    const { jenis_agenda, no_surat, tanggal_surat, status, pihak_terkait, perihal, kategori } = req.body;
    
    if (!jenis_agenda || !no_surat || !tanggal_surat || !pihak_terkait || !perihal) {
      return res.status(400).json({ success: false, message: 'Harap lengkapi semua field yang diwajibkan (*)' });
    }

    const id = `AGD-${Date.now()}`;
    await pool.query(
      `INSERT INTO tb_agenda (id, jenis_agenda, no_surat, tanggal_surat, status, pihak_terkait, perihal, kategori)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, jenis_agenda, no_surat, tanggal_surat, status || 'Biasa', pihak_terkait, perihal, kategori || '']
    );

    // Log aktivitas
    await pool.query(
      'INSERT INTO tb_log_aktivitas (aktivitas, waktu) VALUES (?, ?)',
      [`Mencatat Surat ${jenis_agenda} (${no_surat})`, 'Baru saja']
    );

    res.status(201).json({ success: true, message: 'Data agenda berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
