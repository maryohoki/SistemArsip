const pool = require('./db');
const bcrypt = require('bcryptjs');

async function setupDB() {
  try {
    console.log('Creating table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tb_users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama_lengkap VARCHAR(150) DEFAULT NULL,
        role ENUM('admin','petugas') DEFAULT 'petugas',
        is_active TINYINT(1) DEFAULT 1,
        last_login DATETIME DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Table created.');

    const [rows] = await pool.query('SELECT id FROM tb_users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      console.log('Inserting default admin...');
      const hash = await bcrypt.hash('Admin@Desa2026', 12);
      await pool.query(
        'INSERT INTO tb_users (username, password, nama_lengkap, role) VALUES (?, ?, ?, ?)',
        ['admin', hash, 'Administrator Desa Tanjungsari', 'admin']
      );
      console.log('Default admin created.');
    } else {
      console.log('Admin already exists.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
setupDB();
