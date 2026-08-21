# 📄 Sistem Pengarsipan Administrasi Desa Tanjungsari

> Sistem informasi pengelolaan administrasi surat dan pengarsipan berbasis web untuk Desa Tanjungsari. Mendukung penerbitan surat otomatis, manajemen arsip digital, buku agenda surat, dan template surat resmi desa.

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-MariaDB%2010.4-blue?logo=mysql)](https://www.mysql.com)
[![XAMPP](https://img.shields.io/badge/XAMPP-Apache%20%2B%20PHP-orange?logo=xampp)](https://www.apachefriends.org)

---

## ✨ Fitur Utama

### 📝 Penerbitan Surat
- **30+ jenis surat resmi** desa: SKU, SKTM (6 varian), Kematian, Nikah, Domisili, Pindah, Kuasa, Letter C Bank, dll.
- Auto-generate nomor surat format baku desa
- Preview surat digital sebelum dicetak
- Cetak langsung dari browser
- Tanda tangan digital kepala desa

### 🗄️ Manajemen Arsip
- Simpan arsip otomatis setelah surat diterbitkan
- Pencarian: NIK, nama, nomor surat
- Filter berdasarkan kategori, pagination 10 data/hal
- Ekspor rekapitulasi ke **CSV**
- Hapus arsip dengan konfirmasi

### 📚 Buku Agenda Surat
- Pencatatan surat masuk, keluar, undangan, tugas, edaran, keputusan

### 🗂️ Template Surat
- Katalog 30+ template bawaan
- Tambah/edit/hapus template kustom
- Preview draf template

### ⚙️ Pengaturan & Utilitas
- Edit profil desa & kepala desa
- Import/Export database (JSON)
- Quick Search global (Ctrl+K)
- Grafik tren penerbitan (Chart.js)
- Log aktivitas real-time

---

## 🏗️ Arsitektur Sistem

`
Frontend (Apache XAMPP :80)
    │ HTML/CSS/JS (Vanilla)
    │ api.js → fetch() REST
    ▼
Backend (Node.js + Express :3001)
    │ /api/arsip /api/agenda /api/settings
    │ /api/aktivitas /api/jenis-surat /api/health
    ▼
Database (MariaDB XAMPP)
    db_pengarsipan_desatanjungsari
    ├── tb_arsip_surat
    ├── tb_pengaturan_desa
    ├── tb_log_aktivitas
    └── tb_jenis_surat
`

---

## 🗃️ Skema Database

### 	b_arsip_surat
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | VARCHAR(50) PK | ID transaksi unik |
| 
o_surat | VARCHAR(100) | Nomor surat resmi |
| 
ik | VARCHAR(20) | NIK pemohon |
| 
ama | VARCHAR(150) | Nama pemohon |
| kategori | VARCHAR(100) | Kode jenis surat (SKU, SKTM, dll.) |
| data_spesifik | JSON | Field tambahan per jenis surat |
| 	gl_terbit | VARCHAR(50) | Tanggal terbit |
| created_at | TIMESTAMP | Waktu insert |

### 	b_pengaturan_desa
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| 
ama_kades | VARCHAR(150) | Nama kepala desa |
| 
ip_kades | VARCHAR(50) | NIP kepala desa |
| kabupaten, kecamatan, desa | VARCHAR | Identitas wilayah |
| email, 	elepon | VARCHAR | Kontak desa |

---

## ⚙️ Persyaratan Sistem

| Komponen | Versi Minimum |
|----------|---------------|
| Node.js  | >= 18.0.0 |
| XAMPP    | >= 8.x (Apache + MariaDB 10.4) |
| Browser  | Chrome 90+ / Firefox 88+ |
| OS       | Windows 10/11 |

---

## 🚀 Panduan Instalasi

### 1. Clone Repository
`ash
git clone https://github.com/maryohoki/SistemArsip.git
`

### 2. Jalankan XAMPP
Buka **XAMPP Control Panel** → Start **Apache** dan **MySQL**.

### 3. Import Database
1. Buka [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Buat database: db_pengarsipan_desatanjungsari
3. Import file database.sql dari root folder

### 4. Install Dependensi Backend
`ash
cd backend
npm install
`

### 5. Konfigurasi Database
Edit ackend/src/db.js sesuai setup MySQL Anda:
`javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',   // kosong = default XAMPP
  database: 'db_pengarsipan_desatanjungsari',
});
`

---

## ▶️ Cara Menjalankan

### Opsi A — Otomatis
Double-click **JALANKAN-DISINI.bat** di root folder.

### Opsi B — Manual

**Terminal 1 (Backend):**
`ash
cd backend
node src/server.js
`
Output yang benar:
`
====================================================
  BACKEND API — Desa Tanjungsari
  Berjalan di: http://localhost:3001/api
====================================================
`

**Browser (Frontend):**
`
http://localhost/pengarsipan%20iioo/frontend/
`

---

## 📁 Struktur Folder

`
pengarsipan iioo/
├── JALANKAN-DISINI.bat        ← Jalankan semua otomatis
├── database.sql               ← Schema + data awal
├── database.json              ← Backup JSON
│
├── backend/                   ← Node.js REST API
│   ├── package.json
│   └── src/
│       ├── server.js          ← Entry point Express
│       ├── db.js              ← MySQL pool
│       └── routes/
│           ├── arsip.js       ← CRUD arsip surat
│           ├── agenda.js      ← CRUD buku agenda
│           ├── settings.js    ← Pengaturan desa
│           ├── aktivitas.js   ← Log aktivitas
│           └── jenis.js       ← Template jenis surat
│
└── frontend/                  ← Vanilla HTML/CSS/JS
    ├── index.html             ← SPA utama
    ├── css/styles.css
    ├── js/
    │   ├── app.js             ← Controller utama
    │   ├── api.js             ← HTTP client
    │   ├── letter-templates.js ← Generator HTML surat
    │   └── chart-config.js
    └── assets/logo.svg
`

---

## 🔌 API Documentation

Base URL: http://localhost:3001/api

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/health | Cek status server |
| GET | /api/arsip | List arsip (search, filter, page) |
| GET | /api/arsip/stats | Statistik per kategori |
| GET | /api/arsip/:id | Detail satu arsip |
| POST | /api/arsip | Tambah arsip baru |
| PUT | /api/arsip/:id | Update arsip |
| DELETE | /api/arsip/:id | Hapus arsip |
| GET | /api/agenda | List agenda surat |
| POST | /api/agenda | Tambah catatan agenda |
| GET | /api/settings | Ambil pengaturan desa |
| PUT | /api/settings | Update pengaturan |
| GET | /api/aktivitas | Log aktivitas terbaru |
| GET | /api/jenis-surat | List template surat |
| POST | /api/jenis-surat | Tambah template kustom |

**Query params GET /api/arsip:**
| Param | Default | Keterangan |
|-------|---------|------------|
| search | - | Cari NIK / nama / no_surat |
| ilter | ALL | Kode kategori surat |
| page | 1 | Halaman |
| limit | 10 | Per halaman (max 100) |

---

## 🔧 Troubleshooting

### ❌ "Backend API tidak terjangkau"
1. Pastikan 
ode src/server.js sudah dijalankan di folder ackend/
2. Cek port: 
etstat -ano | findstr "3001"
3. Test: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### ❌ Error koneksi database
1. Aktifkan MySQL di XAMPP Control Panel
2. Pastikan database db_pengarsipan_desatanjungsari sudah diimport
3. Verifikasi username/password di ackend/src/db.js

### ❌ Frontend tidak bisa dibuka
1. Aktifkan Apache di XAMPP Control Panel
2. Pastikan folder ada di C:\xampp\htdocs\pengarsipan iioo\
3. Akses: http://localhost/pengarsipan%20iioo/frontend/

---

## 🌿 Git Workflow

`ash
# Buat branch baru
git switch -c feature/nama-fitur  # fitur baru
git switch -c fix/nama-bug        # perbaikan bug

# Simpan perubahan
git add .
git commit -m "feat: deskripsi singkat"
git push origin nama-branch

# Kembali ke main
git switch main
`

**Konvensi commit:** eat: | ix: | chore: | docs: | efactor:

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

<p align="center">Dibuat dengan ❤️ untuk Administrasi Desa Tanjungsari Digital</p>
