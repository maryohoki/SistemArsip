const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'tanjungsari_desa_jwt_secret_key_2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Format token tidak valid.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan info user di request untuk route berikutnya
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Sesi telah habis atau token tidak valid. Silakan login kembali.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin yang diizinkan.' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin
};
