const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tb_pengaturan_desa LIMIT 1');
    if (rows.length === 0) {
      return res.json({ success: true, data: {} });
    }
    const r = rows[0];
    res.json({
      success: true,
      data: {
        kabupaten: r.kabupaten,
        kecamatan: r.kecamatan,
        desa: r.desa,
        alamat: r.alamat,
        kodePos: r.kode_pos,
        email: r.email,
        telepon: r.telepon,
        namaKades: r.nama_kades,
        nipKades: r.nip_kades,
        jabatanPenandatangan: r.jabatan_penandatangan
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const body = req.body;
    
    // Check if row exists
    const [rows] = await pool.query('SELECT id FROM tb_pengaturan_desa WHERE id = 1');
    if (rows.length > 0) {
      // Update
      await pool.query(
        `UPDATE tb_pengaturan_desa 
         SET kabupaten=?, kecamatan=?, desa=?, alamat=?, kode_pos=?, email=?, telepon=?, nama_kades=?, nip_kades=?, jabatan_penandatangan=?
         WHERE id=1`,
        [
          body.kabupaten, body.kecamatan, body.desa, body.alamat, body.kodePos, body.email,
          body.telepon, body.namaKades, body.nipKades, body.jabatanPenandatangan
        ]
      );
    } else {
      // Insert
      await pool.query(
        `INSERT INTO tb_pengaturan_desa (id, kabupaten, kecamatan, desa, alamat, kode_pos, email, telepon, nama_kades, nip_kades, jabatan_penandatangan)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.kabupaten, body.kecamatan, body.desa, body.alamat, body.kodePos, body.email,
          body.telepon, body.namaKades, body.nipKades, body.jabatanPenandatangan
        ]
      );
    }
    
    res.json({ success: true, data: body });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
