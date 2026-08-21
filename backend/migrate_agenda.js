const pool = require('./src/db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tb_agenda (
        id VARCHAR(50) PRIMARY KEY,
        jenis_agenda VARCHAR(50) NOT NULL,
        no_surat VARCHAR(100) NOT NULL,
        tanggal_surat DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Biasa',
        pihak_terkait VARCHAR(255) NOT NULL,
        perihal TEXT NOT NULL,
        kategori VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Migrasi tb_agenda berhasil.');
    process.exit(0);
  } catch (error) {
    console.error('Migrasi gagal:', error);
    process.exit(1);
  }
}

migrate();
