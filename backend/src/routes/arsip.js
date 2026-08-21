const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/arsip
router.get('/', async (req, res) => {
  try {
    const { search, filter, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM tb_arsip_surat WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM tb_arsip_surat WHERE 1=1';
    const params = [];
    const countParams = [];

    if (filter && filter !== 'ALL') {
      query += ' AND kategori = ?';
      countQuery += ' AND kategori = ?';
      params.push(filter);
      countParams.push(filter);
    }

    if (search) {
      const q = `%${search}%`;
      query += ' AND (nama LIKE ? OR nik LIKE ? OR no_surat LIKE ?)';
      countQuery += ' AND (nama LIKE ? OR nik LIKE ? OR no_surat LIKE ?)';
      params.push(q, q, q);
      countParams.push(q, q, q);
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Order by terbaru
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    // Parse data_spesifik JSON
    const parsedRows = rows.map(r => ({
      id: r.id,
      noSurat: r.no_surat,
      nik: r.nik,
      nama: r.nama,
      tmpLahir: r.tmp_lahir,
      tglLahir: r.tgl_lahir,
      jk: r.jk,
      agama: r.agama,
      pekerjaan: r.pekerjaan,
      alamat: r.alamat,
      kategori: r.kategori,
      keperluan: r.keperluan,
      spesifik: typeof r.data_spesifik === 'string' ? JSON.parse(r.data_spesifik) : r.data_spesifik,
      tglTerbit: r.tgl_terbit,
      petugas: r.petugas
    }));

    res.json({
      success: true,
      data: parsedRows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/arsip/stats
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT kategori, COUNT(*) as count FROM tb_arsip_surat GROUP BY kategori');
    const [totalRes] = await pool.query('SELECT COUNT(*) as total FROM tb_arsip_surat');
    
    const stats = { total: totalRes[0].total };
    rows.forEach(r => {
      stats[r.kategori] = r.count;
    });

    const SKTM_KEYS = ['SKTM', 'SKTM_UMUM', 'SKTM_PELAJAR', 'SKTM_PERCERAIAN', 'SKTM_UPCK', 'SKTM_PBI_BPJS'];
    stats.SKTM_GROUP = SKTM_KEYS.reduce((sum, k) => sum + (stats[k] || 0), 0);
    stats.DOMISILI = stats.DOMISILI || 0;
    
    // Hitung lainnya (yang bukan sktm keys dan domisili)
    let lainnyaCount = 0;
    rows.forEach(r => {
      if (!SKTM_KEYS.includes(r.kategori) && r.kategori !== 'DOMISILI') {
        lainnyaCount += r.count;
      }
    });
    stats.LAINNYA = lainnyaCount;

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/arsip/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tb_arsip_surat WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Arsip tidak ditemukan.' });
    }
    const r = rows[0];
    const record = {
      id: r.id,
      noSurat: r.no_surat,
      nik: r.nik,
      nama: r.nama,
      tmpLahir: r.tmp_lahir,
      tglLahir: r.tgl_lahir,
      jk: r.jk,
      agama: r.agama,
      pekerjaan: r.pekerjaan,
      alamat: r.alamat,
      kategori: r.kategori,
      keperluan: r.keperluan,
      spesifik: typeof r.data_spesifik === 'string' ? JSON.parse(r.data_spesifik) : r.data_spesifik,
      tglTerbit: r.tgl_terbit,
      petugas: r.petugas
    };
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/arsip
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (!body.nik || !body.nama || !body.kategori || !body.noSurat) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib tidak lengkap: nik, nama, kategori, noSurat diperlukan.'
      });
    }

    // Check duplicate
    const [dup] = await pool.query('SELECT id FROM tb_arsip_surat WHERE no_surat = ?', [body.noSurat]);
    if (dup.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Nomor surat "${body.noSurat}" sudah terdaftar dalam arsip.`
      });
    }

    const id = body.id || `TRX-${Date.now()}-${body.kategori}`;
    const spesifik = JSON.stringify(body.spesifik || {});

    await pool.query(
      `INSERT INTO tb_arsip_surat (id, no_surat, nik, nama, tmp_lahir, tgl_lahir, jk, agama, pekerjaan, alamat, kategori, keperluan, data_spesifik, tgl_terbit, petugas) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, body.noSurat, body.nik, body.nama, body.tmpLahir || '', body.tglLahir || '',
        body.jk || 'Laki-laki', body.agama || 'Islam', body.pekerjaan || '', body.alamat || '',
        body.kategori, body.keperluan || '', spesifik, body.tglTerbit || new Date().toISOString().split('T')[0],
        body.petugas || 'Admin Desa'
      ]
    );

    // Insert log aktivitas
    await pool.query(
      'INSERT INTO tb_log_aktivitas (aktivitas, waktu) VALUES (?, ?)',
      [`Surat ${body.kategori} diterbitkan untuk ${body.nama}`, 'Baru saja']
    );

    res.status(201).json({ success: true, data: { ...body, id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/arsip/:id
router.put('/:id', async (req, res) => {
  try {
    const [check] = await pool.query('SELECT id FROM tb_arsip_surat WHERE id = ?', [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Arsip tidak ditemukan.' });
    }

    const body = req.body;
    const spesifik = JSON.stringify(body.spesifik || {});

    await pool.query(
      `UPDATE tb_arsip_surat 
       SET no_surat=?, nik=?, nama=?, tmp_lahir=?, tgl_lahir=?, jk=?, agama=?, pekerjaan=?, alamat=?, kategori=?, keperluan=?, data_spesifik=?, tgl_terbit=?, petugas=?
       WHERE id=?`,
      [
        body.noSurat, body.nik, body.nama, body.tmpLahir, body.tglLahir, body.jk, body.agama, body.pekerjaan, body.alamat,
        body.kategori, body.keperluan, spesifik, body.tglTerbit, body.petugas, req.params.id
      ]
    );

    res.json({ success: true, data: { ...body, id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/arsip/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT nama, kategori FROM tb_arsip_surat WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Arsip tidak ditemukan.' });
    }
    
    const record = rows[0];

    await pool.query('DELETE FROM tb_arsip_surat WHERE id = ?', [req.params.id]);

    await pool.query(
      'INSERT INTO tb_log_aktivitas (aktivitas, waktu) VALUES (?, ?)',
      [`Arsip ${record.kategori} untuk ${record.nama} dihapus`, 'Baru saja']
    );

    res.json({ success: true, message: 'Arsip berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
