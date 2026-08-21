const express = require('express');
const router = express.Router();
const pool = require('../db');

// Definisi default letter types (sinkron dengan frontend/js/data.js)
const DEFAULT_LETTER_TYPES = {
  LAINNYA: { id: 'LAINNYA', code: '470', title: 'Surat Keterangan Lainnya', shortTitle: 'Surat Lainnya', badgeClass: 'cat-lainnya', icon: 'fa-file-signature', categoryGroup: 'umum', desc: 'Surat Keterangan umum atau khusus yang formatnya belum tersedia di sistem.', syarat: ['Fotokopi KTP Pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar dari Ketua RT/RW (Jika diperlukan)'], fields: [{ name: 'judulSurat', label: 'Judul Surat (Huruf Kapital)', required: true }, { name: 'isiSurat', label: 'Isi Keterangan', required: true }] },
  SKU: { id: 'SKU', code: '470', title: 'SKU (Surat Keterangan Usaha)', shortTitle: 'Surat Keterangan Usaha', badgeClass: 'cat-sku', icon: 'fa-store', categoryGroup: 'usaha', desc: 'Keterangan resmi kepemilikan dan lokasi kegiatan usaha warga desa.', syarat: ['Fotokopi KTP Pemohon (Pemilik Usaha)', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar dari Ketua RT/RW', 'Foto / Bukti Lokasi Usaha di Desa Tanjungsari'], fields: [{ name: 'namaUsaha', label: 'Nama Usaha / Toko', required: true }, { name: 'jenisUsaha', label: 'Jenis / Bidang Usaha', required: true }, { name: 'lokasiUsaha', label: 'Alamat / Lokasi Usaha', required: true }, { name: 'tahunBerdiri', label: 'Usaha Berjalan Sejak', required: true }] },
  SKTM: { id: 'SKTM', code: '460', title: 'SKTM Pendidikan / Sekolah', shortTitle: 'SKTM Pendidikan', badgeClass: 'cat-sktm', icon: 'fa-graduation-cap', categoryGroup: 'bantuan', desc: 'Pengajuan Beasiswa Pendidikan, KIP Sekolah, KIP Kuliah, atau keringanan biaya pendidikan.', syarat: ['Fotokopi KTP Orang Tua / Pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar RT/RW Keterangan Tidak Mampu', 'Kartu Pelajar / Surat Keterangan Aktif Sekolah'], fields: [{ name: 'namaAnak', label: 'Nama Siswa / Mahasiswa', required: true }, { name: 'tujuanSktm', label: 'Nama Sekolah / Perguruan Tinggi', required: true }] },
  SKTM_UMUM: { id: 'SKTM_UMUM', code: '460', title: 'SKTM Umum', shortTitle: 'SKTM Umum', badgeClass: 'cat-sktm', icon: 'fa-hand-holding-heart', categoryGroup: 'bantuan', desc: 'Surat Keterangan Tidak Mampu untuk keperluan umum.', syarat: ['Fotokopi KTP Pemohon / Kepala Keluarga', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar RT/RW Keterangan Kurang Mampu'], fields: [{ name: 'tujuanUmum', label: 'Tujuan / Peruntukan SKTM Umum', required: true }, { name: 'jumlahTanggungan', label: 'Jumlah Tanggungan Keluarga', required: false }, { name: 'statusKeluarga', label: 'Status Ekonomi / Keterangan', required: false }] },
  SKTM_PELAJAR: { id: 'SKTM_PELAJAR', code: '460', title: 'SKTM Pelajar / Siswa / Mahasiswa', shortTitle: 'SKTM Pelajar', badgeClass: 'cat-sktm', icon: 'fa-user-graduate', categoryGroup: 'bantuan', desc: 'SKTM khusus Pelajar/Mahasiswa untuk KIP/Beasiswa.', syarat: ['Fotokopi KTP Orang Tua', 'Fotokopi KK', 'Fotokopi Kartu Pelajar / Mahasiswa', 'Surat Pengantar RT/RW'], fields: [{ name: 'namaSiswa', label: 'Nama Pelajar / Siswa / Mahasiswa', required: true }, { name: 'namaSekolah', label: 'Nama Sekolah / Kampus', required: true }, { name: 'kelasJurusan', label: 'Kelas / Tingkat / Jurusan', required: false }, { name: 'tujuanBeasiswa', label: 'Peruntukan / Keperluan SKTM', required: true }] },
  SKTM_PERCERAIAN: { id: 'SKTM_PERCERAIAN', code: '460', title: 'SKTM Perceraian / Prodeo Pengadilan Agama', shortTitle: 'SKTM Perceraian', badgeClass: 'cat-sktm', icon: 'fa-gavel', categoryGroup: 'bantuan', desc: 'SKTM untuk pengajuan perkara perceraian prodeo.', syarat: ['Fotokopi KTP Pemohon', 'Fotokopi KK', 'Fotokopi Buku Nikah', 'Surat Pengantar RT/RW'], fields: [{ name: 'pihakLawan', label: 'Nama Suami / Istri (Tergugat)', required: true }, { name: 'pengadilanTujuan', label: 'Nama Pengadilan Tujuan', required: true }, { name: 'tujuanProdeo', label: 'Peruntukan / Keperluan SKTM', required: true }] },
  SKTM_UPCK: { id: 'SKTM_UPCK', code: '440.1', title: 'SKTM UPCK', shortTitle: 'SKTM UPCK', badgeClass: 'cat-sktm', icon: 'fa-hospital', categoryGroup: 'bantuan', desc: 'SKTM & Rekomendasi ke UPCK untuk jaminan kesehatan.', syarat: ['Fotokopi KTP Pemohon & Pasien', 'Fotokopi KK', 'Surat Rujukan Puskesmas', 'Surat Pengantar RT/RW'], fields: [{ name: 'namaPasienWarga', label: 'Nama Pasien / Warga', required: true }, { name: 'tujuanUpck', label: 'Instansi / Tujuan UPCK', required: true }, { name: 'keperluanUpck', label: 'Peruntukan / Diagnosa', required: true }] },
  SKTM_PBI_BPJS: { id: 'SKTM_PBI_BPJS', code: '440.2', title: 'SKTM PBI / BPJS Kesehatan Gratis', shortTitle: 'SKTM PBI/BPJS', badgeClass: 'cat-sktm', icon: 'fa-shield-heart', categoryGroup: 'bantuan', desc: 'SKTM untuk pengusulan BPJS PBI (Gratis).', syarat: ['Fotokopi KTP Seluruh Anggota Keluarga', 'Fotokopi KK', 'Surat Pengantar RT/RW'], fields: [{ name: 'jenisPengusulan', label: 'Jenis Pengusulan Layanan', required: true }, { name: 'faskesTujuan', label: 'Fasilitas Kesehatan Pertama', required: true }, { name: 'noBpjsLama', label: 'Nomor Kartu BPJS (jika ada)', required: false }] },
  UPCPK: { id: 'UPCPK', code: '440', title: 'Surat Rekomendasi UPCPK', shortTitle: 'Rekomendasi UPCPK', badgeClass: 'cat-bantuan', icon: 'fa-notes-medical', categoryGroup: 'bantuan', desc: 'Rekomendasi jaminan kesehatan bagi warga kurang mampu.', syarat: ['Fotokopi KTP Pemohon & Pasien', 'Fotokopi KK', 'Surat Keterangan Rawat Inap', 'Surat Pengantar RT/RW'], fields: [{ name: 'namaPasien', label: 'Nama Pasien', required: true }, { name: 'hubunganPasien', label: 'Hubungan dengan Pemohon', required: true }, { name: 'namaRumahSakit', label: 'Nama RS / Puskesmas', required: true }, { name: 'diagnosaPenyakit', label: 'Keperluan / Diagnosa Medis', required: true }] },
  DOMISILI: { id: 'DOMISILI', code: '470', title: 'Surat Keterangan Domisili', shortTitle: 'Keterangan Domisili', badgeClass: 'cat-kependudukan', icon: 'fa-house-chimney', categoryGroup: 'kependudukan', desc: 'Keterangan resmi domisili tempat tinggal warga.', syarat: ['Fotokopi KTP & KK', 'Surat Pengantar RT/RW', 'Bukti Kepemilikan Rumah'], fields: [{ name: 'sejakTanggal', label: 'Tinggal Berdomisili Sejak', required: true }, { name: 'statusTempatTinggal', label: 'Status Tempat Tinggal', required: true }] },
  KEMATIAN: { id: 'KEMATIAN', code: '474', title: 'Surat Keterangan Kematian', shortTitle: 'Keterangan Kematian', badgeClass: 'cat-nikah', icon: 'fa-cross', categoryGroup: 'nikah_kematian', desc: 'Pencatatan resmi peristiwa kematian warga.', syarat: ['Fotokopi KTP & KK Almarhum', 'Fotokopi KTP Pelapor', 'Surat Keterangan Kematian dari Dokter/RT', 'KK Asli'], fields: [{ name: 'namaAlmarhum', label: 'Nama Almarhum / Almarhumah', required: true }, { name: 'nikAlmarhum', label: 'NIK Almarhum/ah', required: true }, { name: 'tglMeninggal', label: 'Tanggal Meninggal', type: 'date', required: true }, { name: 'tempatMeninggal', label: 'Tempat Meninggal', required: true }, { name: 'sebabMeninggal', label: 'Penyebab Meninggal', required: true }] },
  NIKAH: { id: 'NIKAH', code: '474.2', title: 'Surat Pengantar Nikah (N1-N4)', shortTitle: 'Pengantar Nikah (N1-N4)', badgeClass: 'cat-nikah', icon: 'fa-heart', categoryGroup: 'nikah_kematian', desc: 'Dokumen pengantar resmi untuk pendaftaran pernikahan di KUA.', syarat: ['Fotokopi KTP & KK Calon Pengantin', 'Fotokopi Akta Kelahiran & Ijazah', 'Pas Foto 2x3 dan 3x4 latar biru'], fields: [{ name: 'namaPasangan', label: 'Nama Calon Suami / Istri', required: true }, { name: 'binBintiPasangan', label: 'Bin / Binti Pasangan', required: true }, { name: 'alamatPasangan', label: 'Alamat Calon Pasangan', required: true }] },
  PINDAH_DATANG: { id: 'PINDAH_DATANG', code: '475', title: 'Surat Keterangan Pindah Datang WNI', shortTitle: 'Pindah Datang WNI', badgeClass: 'cat-kependudukan', icon: 'fa-person-walking-arrow-right', categoryGroup: 'kependudukan', desc: 'Keterangan pendaftaran kepindahan warga WNI masuk ke Desa Tanjungsari.', syarat: ['SKPWNI dari daerah asal', 'Fotokopi KTP & KK Asal', 'Surat Pengantar RT/RW'], fields: [{ name: 'alamatAsal', label: 'Alamat Asal', required: true }, { name: 'alamatTujuan', label: 'Alamat Tujuan', required: true }, { name: 'jumlahPengikut', label: 'Jumlah Anggota Pindah', required: true }] },
  PINDAH_KELUAR: { id: 'PINDAH_KELUAR', code: '475.1', title: 'Surat Keterangan Pindah WNI (Keluar)', shortTitle: 'Surat Pindah WNI', badgeClass: 'cat-kependudukan', icon: 'fa-person-walking-arrow-loop-left', categoryGroup: 'kependudukan', desc: 'Surat pengantar pindah domisili WNI keluar dari Desa Tanjungsari.', syarat: ['KTP & KK Asli', 'Surat Pengantar RT/RW'], fields: [{ name: 'alamatTujuanPindah', label: 'Alamat Tujuan Pindah', required: true }, { name: 'alasanPindah', label: 'Alasan Kepindahan', required: true }, { name: 'pengikutPindah', label: 'Daftar Keluarga Pindah', required: true }] },
  LETTER_C_BANK: { id: 'LETTER_C_BANK', code: '590', title: 'Surat Keterangan Letter C / Syarat Bank', shortTitle: 'Letter C / Syarat Bank', badgeClass: 'cat-sku', icon: 'fa-building-columns', categoryGroup: 'usaha', desc: 'Keterangan kepemilikan Letter C tanah untuk syarat bank.', syarat: ['Fotokopi KTP & KK', 'Fotokopi Buku Letter C / SPPT PBB', 'Surat Pengantar RT/RW'], fields: [{ name: 'nomorPersilC', label: 'Nomor Kohir / Persil Letter C', required: true }, { name: 'luasTanahC', label: 'Luas Tanah (m2)', required: true }, { name: 'bankTujuan', label: 'Nama Bank / Lembaga Keuangan', required: true }] },
  KEHILANGAN: { id: 'KEHILANGAN', code: '331', title: 'Surat Pengantar Kehilangan Kepolisian', shortTitle: 'Pengantar Kehilangan', badgeClass: 'cat-lainnya', icon: 'fa-id-card', categoryGroup: 'umum', desc: 'Pengantar ke Polsek untuk pembuatan Laporan Kehilangan Barang/Dokumen.', syarat: ['Fotokopi KTP & KK', 'Surat Pernyataan Kehilangan', 'Fotokopi Dokumen yang Hilang (jika ada)'], fields: [{ name: 'barangHilang', label: 'Barang / Dokumen yang Hilang', required: true }, { name: 'waktuKehilangan', label: 'Waktu / Tanggal Kehilangan', required: true }, { name: 'lokasiKehilangan', label: 'Perkiraan Lokasi Kehilangan', required: true }] },
  REKOMENDASI_PASANG: { id: 'REKOMENDASI_PASANG', code: '500', title: 'Surat Rekomendasi Pemasangan (Listrik/Air)', shortTitle: 'Rekomendasi Pemasangan', badgeClass: 'cat-lainnya', icon: 'fa-lightbulb', categoryGroup: 'umum', desc: 'Rekomendasi pemasangan baru instalasi Listrik PLN atau Air PDAM.', syarat: ['Fotokopi KTP & KK', 'Surat Pengantar RT/RW'], fields: [{ name: 'jenisInstalasi', label: 'Jenis Pemasangan (PLN/PDAM)', required: true }, { name: 'lokasiPasang', label: 'Lokasi Pemasangan', required: true }, { name: 'perusahaanTujuan', label: 'Perusahaan Tujuan (PT PLN / PDAM)', required: true }] },
  PEMAKAMAN: { id: 'PEMAKAMAN', code: '469', title: 'Surat Keterangan Pemakaman / Izin TPU Desa', shortTitle: 'Izin TPU Desa', badgeClass: 'cat-lainnya', icon: 'fa-monument', categoryGroup: 'umum', desc: 'Izin penggunaan lahan pemakaman di TPU milik Desa Tanjungsari.', syarat: ['Surat Keterangan Kematian', 'KTP Ahli Waris / Pelapor'], fields: [{ name: 'namaJenazah', label: 'Nama Almarhum / Almarhumah', required: true }, { name: 'tglWaktuPemakaman', label: 'Waktu Pemakaman (Hari, Tanggal, Jam)', required: true }, { name: 'tpuTujuan', label: 'Nama TPU Tujuan', required: true }] },
  SUDAH_NIKAH: { id: 'SUDAH_NIKAH', code: '474.2', title: 'Surat Keterangan Sudah Menikah', shortTitle: 'Ket. Sudah Menikah', badgeClass: 'cat-nikah', icon: 'fa-ring', categoryGroup: 'nikah_kematian', desc: 'Keterangan resmi bahwa warga yang bersangkutan telah berstatus menikah.', syarat: ['Fotokopi KTP & KK', 'Fotokopi Buku Nikah', 'Surat Pengantar RT/RW'], fields: [{ name: 'namaPasangan', label: 'Nama Suami / Istri Saat Ini', required: true }, { name: 'tglPernikahan', label: 'Tanggal Pernikahan', required: true }, { name: 'kuaPencatat', label: 'KUA Tempat Tercatat', required: true }] },
  BELUM_NIKAH: { id: 'BELUM_NIKAH', code: '474.2', title: 'Surat Keterangan Belum Pernah Menikah', shortTitle: 'Ket. Belum Menikah', badgeClass: 'cat-nikah', icon: 'fa-user', categoryGroup: 'nikah_kematian', desc: 'Keterangan berstatus belum pernah menikah untuk syarat melamar kerja/TNI/Polri.', syarat: ['Fotokopi KTP & KK', 'Surat Pengantar RT/RW', 'Surat Pernyataan Belum Menikah Bermaterai'], fields: [{ name: 'tujuanSurat', label: 'Tujuan Penggunaan Surat', required: true }] },
  JANDA_DUDA: { id: 'JANDA_DUDA', code: '474.2', title: 'Surat Keterangan Janda / Duda', shortTitle: 'Ket. Janda / Duda', badgeClass: 'cat-nikah', icon: 'fa-user-large-slash', categoryGroup: 'nikah_kematian', desc: 'Keterangan resmi berstatus Janda / Duda (Cerai Hidup atau Cerai Mati).', syarat: ['Fotokopi KTP & KK', 'Fotokopi Akta Cerai / Surat Kematian Pasangan', 'Surat Pengantar RT/RW'], fields: [{ name: 'statusJandaDuda', label: 'Status (Janda / Duda)', required: true }, { name: 'namaMantan', label: 'Nama Mantan Pasangan', required: true }, { name: 'penyebabCerai', label: 'Penyebab (Cerai Mati / Cerai Hidup)', required: true }] },
  SURAT_KETERANGAN: { id: 'SURAT_KETERANGAN', code: '470', title: 'Surat Keterangan', shortTitle: 'Keterangan', badgeClass: 'cat-lainnya', icon: 'fa-file-lines', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Keterangan umum.', syarat: ['KTP', 'KK'], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Keterangan', required: true }] },
  SURAT_PERMOHONAN: { id: 'SURAT_PERMOHONAN', code: '470', title: 'Surat Permohonan', shortTitle: 'Permohonan', badgeClass: 'cat-lainnya', icon: 'fa-envelope-open-text', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Permohonan resmi.', syarat: ['KTP', 'KK'], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Permohonan', required: true }] },
  SURAT_PERNYATAAN: { id: 'SURAT_PERNYATAAN', code: '470', title: 'Surat Pernyataan', shortTitle: 'Pernyataan', badgeClass: 'cat-lainnya', icon: 'fa-pen-to-square', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Pernyataan warga.', syarat: ['KTP', 'KK'], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Pernyataan', required: true }] },
  SURAT_PENGANTAR: { id: 'SURAT_PENGANTAR', code: '470', title: 'Surat Pengantar', shortTitle: 'Pengantar', badgeClass: 'cat-lainnya', icon: 'fa-share-from-square', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Pengantar instansi.', syarat: ['KTP', 'KK'], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Pengantar', required: true }] },
  SURAT_UNDANGAN: { id: 'SURAT_UNDANGAN', code: '470', title: 'Surat Undangan', shortTitle: 'Undangan', badgeClass: 'cat-lainnya', icon: 'fa-envelope', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Undangan desa.', syarat: [], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Undangan', required: true }] },
  SURAT_TUGAS: { id: 'SURAT_TUGAS', code: '470', title: 'Surat Tugas', shortTitle: 'Tugas', badgeClass: 'cat-lainnya', icon: 'fa-clipboard-list', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Tugas aparatur.', syarat: [], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Penugasan', required: true }] },
  SURAT_REKOMENDASI: { id: 'SURAT_REKOMENDASI', code: '470', title: 'Surat Rekomendasi', shortTitle: 'Rekomendasi', badgeClass: 'cat-lainnya', icon: 'fa-thumbs-up', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Rekomendasi desa.', syarat: ['KTP', 'KK'], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Rekomendasi', required: true }] },
  SURAT_KUASA: { id: 'SURAT_KUASA', code: '470', title: 'Surat Kuasa', shortTitle: 'Kuasa', badgeClass: 'cat-lainnya', icon: 'fa-signature', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Kuasa resmi.', syarat: ['KTP Pemberi Kuasa', 'KTP Penerima Kuasa'], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Pemberian Kuasa', required: true }] },
  SURAT_PEMBERITAHUAN: { id: 'SURAT_PEMBERITAHUAN', code: '470', title: 'Surat Pemberitahuan', shortTitle: 'Pemberitahuan', badgeClass: 'cat-lainnya', icon: 'fa-bullhorn', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Pemberitahuan.', syarat: [], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Pemberitahuan', required: true }] }
};

// GET /api/jenis-surat
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tb_jenis_surat');
    const customTemplates = {};
    rows.forEach(r => {
      customTemplates[r.kode_jenis] = {
        id: r.kode_jenis,
        code: r.kode_klasifikasi,
        title: r.judul_surat,
        shortTitle: r.judul_singkat,
        categoryGroup: r.kategori_grup,
        desc: r.deskripsi,
        syarat: typeof r.syarat_persyaratan === 'string' ? JSON.parse(r.syarat_persyaratan) : r.syarat_persyaratan,
        fields: typeof r.fields_dinamis === 'string' ? JSON.parse(r.fields_dinamis) : r.fields_dinamis,
        badgeClass: 'cat-lainnya',
        icon: 'fa-file-signature'
      };
    });
    
    const allTemplates = { ...DEFAULT_LETTER_TYPES, ...customTemplates };
    res.json({ success: true, data: allTemplates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jenis-surat
router.post('/', async (req, res) => {
  try {
    const template = req.body;
    if (!template.title || !template.code) {
      return res.status(400).json({ success: false, message: 'Field "title" dan "code" wajib diisi.' });
    }

    const templateId = template.id || `CUSTOM_${Date.now()}`;
    template.id = templateId;
    if (!template.badgeClass) template.badgeClass = 'cat-lainnya';
    if (!template.icon) template.icon = 'fa-file-signature';
    if (!template.categoryGroup) template.categoryGroup = 'rekomendasi';
    if (!template.syarat) template.syarat = ['Fotokopi KTP Pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar RT/RW'];

    await pool.query(
      `INSERT INTO tb_jenis_surat (kode_jenis, kode_klasifikasi, judul_surat, judul_singkat, kategori_grup, deskripsi, syarat_persyaratan, fields_dinamis)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        templateId, template.code, template.title, template.shortTitle || template.title,
        template.categoryGroup, template.desc || '', JSON.stringify(template.syarat),
        JSON.stringify(template.fields || [])
      ]
    );

    res.status(201).json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/jenis-surat/:id
router.put('/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const [check] = await pool.query('SELECT kode_jenis FROM tb_jenis_surat WHERE kode_jenis = ?', [templateId]);
    
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Template tidak ditemukan atau bukan custom template.' });
    }

    const template = req.body;
    await pool.query(
      `UPDATE tb_jenis_surat 
       SET kode_klasifikasi=?, judul_surat=?, judul_singkat=?, kategori_grup=?, deskripsi=?, syarat_persyaratan=?, fields_dinamis=?
       WHERE kode_jenis=?`,
      [
        template.code, template.title, template.shortTitle || template.title, template.categoryGroup,
        template.desc || '', JSON.stringify(template.syarat || []), JSON.stringify(template.fields || []),
        templateId
      ]
    );

    res.json({ success: true, data: { ...template, id: templateId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/jenis-surat/:id
router.delete('/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const [check] = await pool.query('SELECT kode_jenis FROM tb_jenis_surat WHERE kode_jenis = ?', [templateId]);
    
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Template custom tidak ditemukan.' });
    }

    await pool.query('DELETE FROM tb_jenis_surat WHERE kode_jenis = ?', [templateId]);

    res.json({ success: true, message: 'Template custom berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
