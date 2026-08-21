/**
 * Data Storage & State Management for Tanjungsari Village Archiving System
 */

const STORAGE_KEYS = {
  RECORDS: 'tanjungsari_surat_records',
  SETTINGS: 'tanjungsari_village_settings',
  ACTIVITIES: 'tanjungsari_activity_logs',
  TEMPLATES: 'tanjungsari_letter_templates'
};

// Default Village Information
const DEFAULT_VILLAGE_SETTINGS = {
  kabupaten: 'Kabupaten Tasikmalaya',
  kecamatan: 'Kecamatan Salawu',
  desa: 'Desa Tanjungsari',
  alamat: 'Jl. Raya Tasikmalaya-Garut KM. 34 Kp. Langkob RT 004 RW 001',
  kodePos: '46471',
  email: 'desatanjungsarisalawu@gmail.com',
  telepon: '+62 899-9273-848',
  namaKades: 'ATEP ABDUL CHOLIK',
  nipKades: '-',
  jabatanPenandatangan: 'Kepala Desa Tanjungsari'
};

/// Letter Types Configuration & Default Templates
const LETTER_TYPES = {
  LAINNYA: {
    id: 'LAINNYA',
    code: '470',
    title: 'Surat Keterangan Lainnya',
    shortTitle: 'Surat Lainnya',
    badgeClass: 'cat-lainnya',
    icon: 'fa-file-signature',
    categoryGroup: 'umum',
    desc: 'Surat Keterangan umum atau khusus yang formatnya belum tersedia di sistem.',
    syarat: [
      'Fotokopi KTP Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari Ketua RT/RW (Jika diperlukan)'
    ],
    fields: [
      { name: 'judulSurat', label: 'Judul Surat (Huruf Kapital)', placeholder: 'Misal: SURAT KETERANGAN BELUM MENIKAH', required: true },
      { name: 'isiSurat', label: 'Isi Keterangan', placeholder: 'Ketik isi utama dari surat keterangan tersebut...', required: true }
    ]
  },
  SKU: {
    id: 'SKU',
    code: '470',
    title: 'SKU (Surat Keterangan Usaha)',
    shortTitle: 'Surat Keterangan Usaha',
    badgeClass: 'cat-sku',
    icon: 'fa-store',
    categoryGroup: 'usaha',
    desc: 'Keterangan resmi kepemilikan dan lokasi kegiatan usaha warga desa.',
    syarat: [
      'Fotokopi KTP Pemohon (Pemilik Usaha)',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari Ketua RT/RW',
      'Foto / Bukti Lokasi Usaha di Desa Tanjungsari'
    ],
    fields: [
      { name: 'namaUsaha', label: 'Nama Usaha / Toko', placeholder: 'Misal: Toko Sembako Barokah', required: true },
      { name: 'jenisUsaha', label: 'Jenis / Bidang Usaha', placeholder: 'Misal: Perdagangan Sembako & Kelontong', required: true },
      { name: 'lokasiUsaha', label: 'Alamat / Lokasi Usaha', placeholder: 'Misal: Dusun Tanjungsari RT 02 RW 05', required: true },
      { name: 'tahunBerdiri', label: 'Usaha Berjalan Sejak', placeholder: 'Misal: Tahun 2019', required: true }
    ]
  },
  SKTM: {
    id: 'SKTM',
    code: '460',
    title: 'SKTM Pendidikan / Sekolah',
    shortTitle: 'SKTM Pendidikan',
    badgeClass: 'cat-sktm',
    icon: 'fa-graduation-cap',
    categoryGroup: 'bantuan',
    desc: 'Pengajuan Beasiswa Pendidikan, KIP Sekolah, KIP Kuliah, atau keringanan biaya pendidikan.',
    syarat: [
      'Fotokopi KTP Orang Tua / Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar RT/RW Keterangan Tidak Mampu',
      'Kartu Pelajar / Surat Keterangan Aktif Sekolah'
    ],
    fields: [
      { name: 'namaAnak', label: 'Nama Siswa / Mahasiswa', placeholder: 'Misal: Ahmad Fauzi (Anak)', required: true },
      { name: 'tujuanSktm', label: 'Nama Sekolah / Perguruan Tinggi', placeholder: 'Misal: SMAN 1 Salawu / Universitas Siliwangi', required: true }
    ]
  },
  SKTM_UMUM: {
    id: 'SKTM_UMUM',
    code: '460',
    title: 'SKTM Umum (Surat Keterangan Tidak Mampu Umum)',
    shortTitle: 'SKTM Umum',
    badgeClass: 'cat-sktm',
    icon: 'fa-hand-holding-heart',
    categoryGroup: 'bantuan',
    desc: 'Surat Keterangan Tidak Mampu untuk keperluan umum, bantuan sosial desa, keringanan PLN, atau insentif pemerintah.',
    syarat: [
      'Fotokopi KTP Pemohon / Kepala Keluarga',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar RT/RW Keterangan Kurang Mampu',
      'Kartu PKH / KKS / DTKS / PBI (jika ada)'
    ],
    fields: [
      { name: 'tujuanUmum', label: 'Tujuan / Peruntukan SKTM Umum', placeholder: 'Misal: Permohonan Bantuan Sosial / Keringanan Biaya PLN / Pengajuan Bansos DTKS', required: true },
      { name: 'jumlahTanggungan', label: 'Jumlah Tanggungan Keluarga', placeholder: 'Misal: 4 Orang (1 Istri, 3 Anak)', required: false },
      { name: 'statusKeluarga', label: 'Status Ekonomi / Keterangan', placeholder: 'Misal: Keluarga Kurang Mampu / Desil 1 DTKS', required: false }
    ]
  },
  SKTM_PELAJAR: {
    id: 'SKTM_PELAJAR',
    code: '460',
    title: 'SKTM Pelajar / Siswa / Mahasiswa',
    shortTitle: 'SKTM Pelajar',
    badgeClass: 'cat-sktm',
    icon: 'fa-user-graduate',
    categoryGroup: 'bantuan',
    desc: 'Surat Keterangan Tidak Mampu khusus Pelajar / Siswa / Mahasiswa untuk pengajuan KIP Sekolah, KIP Kuliah, Beasiswa, atau keringanan SPP.',
    syarat: [
      'Fotokopi KTP Orang Tua / Wali Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Kartu Pelajar / Mahasiswa / Surat Aktif Sekolah',
      'Surat Pengantar RT/RW Keterangan Kurang Mampu'
    ],
    fields: [
      { name: 'namaSiswa', label: 'Nama Pelajar / Siswa / Mahasiswa', placeholder: 'Misal: Ahmad Fauzi (Anak Kandung)', required: true },
      { name: 'namaSekolah', label: 'Nama Sekolah / Kampus', placeholder: 'Misal: SMAN 1 Salawu / Universitas Siliwangi', required: true },
      { name: 'kelasJurusan', label: 'Kelas / Tingkat / Jurusan', placeholder: 'Misal: Kelas XII IPA 2 / Semester 4 Teknik', required: false },
      { name: 'tujuanBeasiswa', label: 'Peruntukan / Keperluan SKTM', placeholder: 'Misal: Pengajuan Beasiswa KIP Kuliah / Keringanan Biaya SPP', required: true }
    ]
  },
  SKTM_PERCERAIAN: {
    id: 'SKTM_PERCERAIAN',
    code: '460',
    title: 'SKTM Perceraian / Prodeo Pengadilan Agama',
    shortTitle: 'SKTM Perceraian',
    badgeClass: 'cat-sktm',
    icon: 'fa-scale-balanced',
    categoryGroup: 'bantuan',
    desc: 'Surat Keterangan Tidak Mampu khusus pengajuan perkara perceraian / pembebasan biaya perkara (Prodeo) di Pengadilan Agama / Pengadilan Negeri.',
    syarat: [
      'Fotokopi KTP Pemohon (Penggugat / Pemohon)',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Buku Nikah / Akta Nikah (jika ada)',
      'Surat Pengantar RT/RW Keterangan Kurang Mampu untuk Prodeo Pengadilan'
    ],
    fields: [
      { name: 'pihakLawan', label: 'Nama Suami / Istri (Tergugat / Termohon)', placeholder: 'Misal: Hendra Wijaya (Tergugat)', required: true },
      { name: 'pengadilanTujuan', label: 'Nama Pengadilan Tujuan', placeholder: 'Misal: Pengadilan Agama Singaparna / Pengadilan Agama Tasikmalaya', required: true },
      { name: 'tujuanProdeo', label: 'Peruntukan / Keperluan SKTM', placeholder: 'Misal: Permohonan Pembebasan Biaya Perkara (Prodeo) Perceraian', required: true }
    ]
  },
  SKTM_UPCK: {
    id: 'SKTM_UPCK',
    code: '440.1',
    title: 'SKTM UPCK (Rekomendasi Penanggulangan Kemiskinan)',
    shortTitle: 'SKTM UPCK',
    badgeClass: 'cat-sktm',
    icon: 'fa-notes-medical',
    categoryGroup: 'bantuan',
    desc: 'Surat Keterangan Tidak Mampu dan Rekomendasi ke Unit Pelayanan Terpadu Penanggulangan Kemiskinan (UPCK) untuk Jaminan Pelayanan Kesehatan Desa & RSUD.',
    syarat: [
      'Fotokopi KTP Pemohon & Pasien',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Keterangan Rujukan Puskesmas / Rawat Inap RSUD',
      'Surat Pengantar RT/RW Keterangan Tidak Mampu'
    ],
    fields: [
      { name: 'namaPasienWarga', label: 'Nama Pasien / Warga Tanggungan', placeholder: 'Misal: Dadang Hendra (Diri Sendiri)', required: true },
      { name: 'tujuanUpck', label: 'Instansi / Tujuan UPCK', placeholder: 'Misal: Dinas Kesehatan / RSUD SMC Kabupaten Tasikmalaya', required: true },
      { name: 'keperluanUpck', label: 'Peruntukan / Diagnosa / Bantuan', placeholder: 'Misal: Pengajuan Jaminan Pelayanan Kesehatan Rawat Inap', required: true }
    ]
  },
  SKTM_PBI_BPJS: {
    id: 'SKTM_PBI_BPJS',
    code: '440.2',
    title: 'SKTM Integrasi PBI / BPJS Kesehatan Gratis',
    shortTitle: 'SKTM PBI/BPJS',
    badgeClass: 'cat-sktm',
    icon: 'fa-id-card-clip',
    categoryGroup: 'bantuan',
    desc: 'Surat Keterangan Tidak Mampu untuk pengusulan pendaftaran / reaktivasi Kartu BPJS Kesehatan PBI (Penerima Bantuan Iuran) APBD/APBN melalui Dinsos & Dinkes.',
    syarat: [
      'Fotokopi KTP Seluruh Anggota Keluarga',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar RT/RW Keterangan Tidak Mampu PBI BPJS',
      'Fotokopi Kartu BPJS Mandiri / Non-Aktif (jika ada reaktivasi)'
    ],
    fields: [
      { name: 'jenisPengusulan', label: 'Jenis Pengusulan Layanan', placeholder: 'Misal: Pendaftaran PBI APBD Baru / Reaktivasi BPJS PBI Non-Aktif', required: true },
      { name: 'faskesTujuan', label: 'Fasilitas Kesehatan Pertama (FKTP)', placeholder: 'Misal: Puskesmas Salawu / Klinik Tanjungsari', required: true },
      { name: 'noBpjsLama', label: 'Nomor Kartu BPJS (jika ada)', placeholder: 'Misal: 0001829304958 (Kosongkan jika baru pertama kali)', required: false }
    ]
  },
  UPCPK: {
    id: 'UPCPK',
    code: '440',
    title: 'Surat Rekomendasi UPCPK (Jaminan Kesehatan)',
    shortTitle: 'Rekomendasi UPCPK',
    badgeClass: 'cat-sktm',
    icon: 'fa-hospital-user',
    categoryGroup: 'bantuan',
    desc: 'Rekomendasi jaminan pelayanan kesehatan bagi warga kurang mampu ke UPCPK / Dinkes / RSUD.',
    syarat: [
      'Fotokopi KTP Pemohon & Pasien',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Keterangan Rawat Inap / Rujukan Puskesmas atau RSUD',
      'Surat Pengantar RT/RW Keterangan Kurang Mampu'
    ],
    fields: [
      { name: 'namaPasien', label: 'Nama Pasien / Yang Sakit', placeholder: 'Misal: Dadang Hendra (Diri Sendiri)', required: true },
      { name: 'hubunganPasien', label: 'Hubungan dengan Pemohon', placeholder: 'Misal: Diri Sendiri / Anak / Istri / Suami / Orang Tua', required: true },
      { name: 'namaRumahSakit', label: 'Nama RS / Puskesmas Tujuan', placeholder: 'Misal: RSUD SMC Tasikmalaya / RSUD dr. Soekardjo', required: true },
      { name: 'diagnosaPenyakit', label: 'Keperluan / Diagnosa Medis', placeholder: 'Misal: Pengobatan Rawat Inap & Tindakan Medis Spesialis', required: true }
    ]
  },
  KEMATIAN: { id: 'KEMATIAN', code: '474', title: 'Surat Keterangan Kematian', shortTitle: 'Keterangan Kematian', badgeClass: 'cat-nikah', icon: 'fa-cross', categoryGroup: 'nikah_kematian', desc: 'Pencatatan resmi peristiwa kematian warga.', syarat: ['Fotokopi KTP & KK Almarhum', 'Fotokopi KTP Pelapor', 'Surat Keterangan Kematian dari Dokter/RT', 'KK Asli'], fields: [{ name: 'namaAlmarhum', label: 'Nama Almarhum / Almarhumah', required: true }, { name: 'nikAlmarhum', label: 'NIK Almarhum/ah', required: true, isNik: true }, { name: 'tglMeninggal', label: 'Tanggal Meninggal', type: 'date', required: true }, { name: 'tempatMeninggal', label: 'Tempat Meninggal', required: true }, { name: 'sebabMeninggal', label: 'Penyebab Meninggal', required: true }] },
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
  SURAT_PEMBERITAHUAN: { id: 'SURAT_PEMBERITAHUAN', code: '470', title: 'Surat Pemberitahuan', shortTitle: 'Pemberitahuan', badgeClass: 'cat-lainnya', icon: 'fa-bullhorn', categoryGroup: 'surat_lainnya', desc: 'Pembuatan Surat Pemberitahuan.', syarat: [], fields: [{ name: 'judulSurat', label: 'Judul Surat', required: true }, { name: 'isiSurat', label: 'Isi Pemberitahuan', required: true }] },
  DOMISILI: {
    id: 'DOMISILI',
    code: '470',
    title: 'Surat Keterangan Domisili',
    shortTitle: 'Keterangan Domisili',
    badgeClass: 'cat-domisili',
    icon: 'fa-house-user',
    categoryGroup: 'kependudukan',
    desc: 'Keterangan resmi domisili tempat tinggal warga atau tempat usaha.',
    syarat: [
      'Fotokopi KTP & Kartu Keluarga (KK)',
      'Surat Pengantar dari Ketua RT & RW Setempat',
      'Bukti Kepemilikan Rumah / Surat Perjanjian Kontrak'
    ],
    fields: [
      { name: 'sejakTanggal', label: 'Tinggal Berdomisili Sejak', placeholder: 'Misal: Tahun 2016', required: true },
      { name: 'statusTempatTinggal', label: 'Status Tempat Tinggal', placeholder: 'Misal: Milik Sendiri / Kontrak / Sewa', required: true }
    ]
  },
  PINDAH_DATANG: {
    id: 'PINDAH_DATANG',
    code: '475',
    title: 'Surat Keterangan Pindah Datang WNI',
    shortTitle: 'Pindah Datang WNI',
    badgeClass: 'cat-domisili',
    icon: 'fa-person-walking-arrow-loop-left',
    categoryGroup: 'kependudukan',
    desc: 'Keterangan pendaftaran kepindahan kedatangan warga WNI dari daerah asal masuk ke Desa Tanjungsari.',
    syarat: [
      'Surat Keterangan Pindah (SKPWNI) dari Daerah Asal',
      'Fotokopi KTP & Kartu Keluarga (KK) Asal',
      'Surat Pengantar RT/RW Domisili Baru',
      'Pas Foto 3x4 (2 lembar)'
    ],
    fields: [
      { name: 'alamatAsal', label: 'Alamat Asal (Desa/Kec/Kab)', placeholder: 'Misal: Desa Sukatani, Kec. Salawu, Kab. Tasikmalaya', required: true },
      { name: 'alamatTujuan', label: 'Alamat Tujuan di Tanjungsari', placeholder: 'Misal: Dusun Tanjungsari RT 02 RW 04', required: true },
      { name: 'jumlahPengikut', label: 'Jumlah Anggota Keluarga Pindah', placeholder: 'Misal: 3 Orang (Suami, Istri, 1 Anak)', required: true }
    ]
  },
  PINDAH_KELUAR: {
    id: 'PINDAH_KELUAR',
    code: '475.1',
    title: 'Surat Keterangan Pindah WNI (Keluar)',
    shortTitle: 'Surat Pindah WNI',
    badgeClass: 'cat-domisili',
    icon: 'fa-person-walking-arrow-right',
    categoryGroup: 'kependudukan',
    desc: 'Surat pengantar permohonan pindah domisili WNI keluar dari Desa Tanjungsari ke daerah tujuan.',
    syarat: [
      'KTP & Kartu Keluarga (KK) Asli Desa Tanjungsari',
      'Surat Pengantar RT/RW Setempat',
      'Pas Foto 3x4 (3 lembar)'
    ],
    fields: [
      { name: 'alamatTujuanPindah', label: 'Alamat Tujuan Pindah (Lengkap)', placeholder: 'Misal: RT 03 RW 05 Desa Cikupa, Kec. Salawu, Kab. Tasikmalaya', required: true },
      { name: 'alasanPindah', label: 'Alasan Kepindahan', placeholder: 'Misal: Mengikuti Suami / Pekerjaan / Domisili Baru', required: true },
      { name: 'pengikutPindah', label: 'Daftar Anggota Keluarga Yang Pindah', type: 'textarea', placeholder: '1. Endang (Kepala Keluarga)\n2. Siti (Istri)', required: true }
    ]
  },
  LETTER_C_BANK: {
    id: 'LETTER_C_BANK',
    code: '590',
    title: 'Surat Keterangan Letter C / Keterangan Tanah Syarat Bank',
    shortTitle: 'Letter C / Syarat Bank',
    badgeClass: 'cat-sku',
    icon: 'fa-file-invoice-dollar',
    categoryGroup: 'usaha',
    desc: 'Keterangan kepemilikan persil/Letter C buku tanah desa dan agunan pengajuan pinjaman/kredit bank.',
    syarat: [
      'Fotokopi KTP & KK Pemohon',
      'Fotokopi / Bukti Buku Letter C / SPPT PBB',
      'Surat Pengantar RT/RW',
      'Surat Pernyataan Tanah Tidak Dalam Sengketa'
    ],
    fields: [
      { name: 'nomorPersilC', label: 'Nomor Kohir / Persil Letter C', placeholder: 'Misal: Kohir No. 412 Persil 14 S.II', required: true },
      { name: 'luasTanahC', label: 'Luas Tanah (m²)', placeholder: 'Misal: Luas ± 450 m²', required: true },
      { name: 'bankTujuan', label: 'Nama Bank / Lembaga Keuangan', placeholder: 'Misal: Bank BRI Cabang Salawu / Bank BJB', required: true }
    ]
  },
  NA_NIKAH: {
    id: 'NA_NIKAH',
    code: '474.2',
    title: 'Surat Keterangan NA (N1-N6 Pengantar Nikah)',
    shortTitle: 'Surat NA Nikah',
    badgeClass: 'cat-nikah',
    icon: 'fa-hands-holding-child',
    categoryGroup: 'nikah_kematian',
    desc: 'Kelengkapan naskah pengantar nikah NA (Formulir N1-N6) resmi untuk pendaftaran pemeriksaan nikah di KUA.',
    syarat: [
      'Fotokopi KTP & KK Calon Pengantin',
      'Fotokopi Akta Kelahiran & Ijazah Terakhir',
      'Pas Foto 2x3 dan 3x4 Biru (4 lembar)',
      'Surat Pengantar RT/RW Setempat',
      'Form N3 / Surat Persetujuan Calon Pengantin'
    ],
    fields: [
      { name: 'namaPasanganNa', label: 'Nama Calon Suami / Istri', placeholder: 'Nama lengkap calon pengantin pasangan', required: true },
      { name: 'binPasanganNa', label: 'Bin / Binti Pasangan', placeholder: 'Misal: Bin H. Abdullah', required: true },
      { name: 'kuaTujuan', label: 'KUA Kecamatan Tujuan', placeholder: 'Misal: KUA Kecamatan Salawu / KUA Kecamatan Singaparna', required: true }
    ]
  },
  TAKSIRAN_TANAH: {
    id: 'TAKSIRAN_TANAH',
    code: '593',
    title: 'Surat Keterangan Harga Taksiran Tanah',
    shortTitle: 'Taksiran Harga Tanah',
    badgeClass: 'cat-lainnya',
    icon: 'fa-chart-area',
    categoryGroup: 'rekomendasi',
    desc: 'Keterangan perkiraan estimasi harga pasaran wajar tanah & bangunan di wilayah Desa Tanjungsari.',
    syarat: [
      'Fotokopi KTP & KK Pemilik Tanah',
      'Fotokopi Sertifikat Hak Milik (SHM) / Letter C / SPPT PBB',
      'Surat Pengantar RT/RW Setempat'
    ],
    fields: [
      { name: 'lokasiBumi', label: 'Lokasi / Blok Tanah', placeholder: 'Misal: Blok Langkob RT 04 RW 01 Desa Tanjungsari', required: true },
      { name: 'luasBumi', label: 'Luas Tanah & Bangunan', placeholder: 'Misal: Tanah 300 m² / Bangunan 120 m²', required: true },
      { name: 'hargaPerMeter', label: 'Taksiran Harga Pasaran per m²', placeholder: 'Misal: Rp 350.000,- / m²', required: true },
      { name: 'totalTaksiran', label: 'Total Estimasi Nilai Taksiran', placeholder: 'Misal: Rp 105.000.000,- (Seratus Lima Juta Rupiah)', required: true }
    ]
  },
  KETERANGAN_KERJA: {
    id: 'KETERANGAN_KERJA',
    code: '560',
    title: 'Surat Keterangan Pekerjaan / Mata Pencaharian',
    shortTitle: 'Keterangan Pekerjaan',
    badgeClass: 'cat-domisili',
    icon: 'fa-briefcase',
    categoryGroup: 'kependudukan',
    desc: 'Keterangan resmi mata pencaharian / pekerjaan aktual warga desa (Petani, Buruh, Wiraswasta, Pedagang).',
    syarat: [
      'Fotokopi KTP Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar Ketua RT/RW Setempat'
    ],
    fields: [
      { name: 'jenisPekerjaanAktual', label: 'Jenis Pekerjaan / Profesi Aktual', placeholder: 'Misal: Petani Penggarap / Buruh Bangunan / Pedagang Keliling', required: true },
      { name: 'lokasiKerja', label: 'Tempat / Lokasi Bekerja', placeholder: 'Misal: Wilayah Desa Tanjungsari & Sekitarnya', required: true },
      { name: 'keperluanSuratKerja', label: 'Tujuan Permohonan Surat', placeholder: 'Misal: Persyaratan Pengajuan Beasiswa / Pengurusan Administrasi Bank', required: true }
    ]
  },
  IZIN_KERAMAIAN: {
    id: 'IZIN_KERAMAIAN',
    code: '338',
    title: 'Surat Pengantar Izin Keramaian / Acara Masyarakat',
    shortTitle: 'Izin Keramaian',
    badgeClass: 'cat-lainnya',
    icon: 'fa-bullhorn',
    categoryGroup: 'rekomendasi',
    desc: 'Rekomendasi/izin penyelenggaraan kegiatan keramaian (Hajatan, Pentas Seni, Turnamen Olahraga, Pengajian).',
    syarat: [
      'Fotokopi KTP Ketua Panitia / Sohibul Hajat',
      'Surat Pengantar RT/RW Setempat',
      'Jadwal & Susunan Acara Kegiatan',
      'Surat Pernyataan Menjaga Ketertiban & Keamanan'
    ],
    fields: [
      { name: 'namaAcara', label: 'Nama / Jenis Kegiatan', placeholder: 'Misal: Resepsi Pernikahan & Hiburan Musik / Turnamen Sepakbola Desa', required: true },
      { name: 'tglWaktuAcara', label: 'Tanggal & Waktu Pelaksanaan', placeholder: 'Misal: Sabtu, 15 Agustus 2026 (Pukul 08.00 - 23.00 WIB)', required: true },
      { name: 'lokasiAcara', label: 'Tempat / Lokasi Kegiatan', placeholder: 'Misal: Lapangan Sepakbola Kp. Langkob RT 04 RW 01', required: true },
      { name: 'hiburanBintang', label: 'Jenis Hiburan / Pengisi Acara', placeholder: 'Misal: Seni Calung & Organ Tunggal', required: false }
    ]
  },
  BEDA_NAMA: {
    id: 'BEDA_NAMA',
    code: '470',
    title: 'Surat Keterangan Beda Nama',
    shortTitle: 'Keterangan Beda Nama',
    badgeClass: 'cat-lainnya',
    categoryGroup: 'kependudukan',
    icon: 'fa-id-card',
    desc: 'Klarifikasi resmi perbedaan ejaan nama pada dokumen kependudukan.',
    syarat: [
      'Fotokopi KTP dan Kartu Keluarga (KK)',
      'Fotokopi Dokumen yang Berbeda Nama (Ijazah / Sertifikat / Buku Nikah)',
      'Surat Pengantar RT/RW setempat'
    ],
    fields: [
      { name: 'namaDiDoc1', label: 'Nama Tertera di KTP / KK', placeholder: 'Misal: Suparman', required: true },
      { name: 'namaDiDoc2', label: 'Nama Tertera di Ijazah / Dokumen Lain', placeholder: 'Misal: Suparman Hidayat', required: true },
      { name: 'penjelasanPerbedaan', label: 'Keterangan Klarifikasi', placeholder: 'Bahwa kedua nama tersebut adalah ORANG YANG SAMA', required: true }
    ]
  },
  BELUM_NIKAH: {
    id: 'BELUM_NIKAH',
    code: '470',
    title: 'Surat Keterangan Belum Menikah',
    shortTitle: 'Keterangan Belum Menikah',
    badgeClass: 'cat-lainnya',
    categoryGroup: 'kependudukan',
    icon: 'fa-user-check',
    desc: 'Keterangan resmi status lajang / belum pernah menikah.',
    syarat: [
      'Fotokopi KTP Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar RT/RW Keterangan Belum Menikah',
      'Surat Pernyataan Belum Menikah Bermaterai 10.000'
    ],
    fields: []
  },
  SKCK: {
    id: 'SKCK',
    code: '300',
    title: 'Surat Pengantar SKCK',
    shortTitle: 'Pengantar SKCK',
    badgeClass: 'cat-sku',
    categoryGroup: 'rekomendasi',
    icon: 'fa-user-shield',
    desc: 'Rekomendasi pengurusan Catatan Kepolisian (Polsek/Polres).',
    syarat: [
      'Fotokopi KTP Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Akta Kelahiran / Ijazah Terakhir',
      'Pas Foto Ukuran 4x6 Latar Belakang Merah (4 lembar)',
      'Surat Pengantar RT/RW Setempat'
    ],
    fields: [
      { name: 'keperluanSkck', label: 'Tujuan Pengurusan SKCK', placeholder: 'Misal: Melamar Pekerjaan / Seleksi CPNS / BUMN', required: true }
    ]
  },
  PENGHASILAN: {
    id: 'PENGHASILAN',
    code: '470',
    title: 'Surat Keterangan Penghasilan Orang Tua',
    shortTitle: 'Keterangan Penghasilan',
    badgeClass: 'cat-sktm',
    categoryGroup: 'bantuan',
    icon: 'fa-wallet',
    desc: 'Keterangan jumlah estimasi pendapatan rata-rata orang tua/wali.',
    syarat: [
      'Fotokopi KTP Orang Tua & Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar RT/RW Keterangan Pekerjaan dan Rata-rata Penghasilan'
    ],
    fields: [
      { name: 'nominalPenghasilan', label: 'Rata-rata Penghasilan per Bulan', placeholder: 'Misal: Rp 1.800.000,- (Satu Juta Delapan Ratus Ribu Rupiah)', required: true },
      { name: 'tujuanPenghasilan', label: 'Peruntukan Dokumen', placeholder: 'Misal: Persyaratan Registrasi Ulang Perguruan Tinggi (UKT)', required: true }
    ]
  },
  KELAHIRAN: {
    id: 'KELAHIRAN',
    code: '474.1',
    title: 'Surat Keterangan Kelahiran',
    shortTitle: 'Keterangan Kelahiran',
    badgeClass: 'cat-domisili',
    categoryGroup: 'kependudukan',
    icon: 'fa-baby',
    desc: 'Pencatatan resmi peristiwa kelahiran bayi di Desa Tanjungsari.',
    syarat: [
      'Surat Keterangan Lahir dari Bidan / Rumah Sakit / Dokter',
      'Fotokopi KTP Ayah & Ibu',
      'Fotokopi Buku Nikah Orang Tua',
      'Fotokopi Kartu Keluarga (KK)'
    ],
    fields: [
      { name: 'namaBayi', label: 'Nama Bayi / Anak', placeholder: 'Nama lengkap bayi', required: true },
      { name: 'tglLahirBayi', label: 'Tanggal Lahir Bayi', type: 'date', required: true },
      { name: 'jamLahir', label: 'Jam Kelahiran', placeholder: 'Misal: 08:30 WIB', required: true },
      { name: 'namaAyah', label: 'Nama Ayah Kandung', placeholder: 'Nama Ayah sesuai KTP', required: true },
      { name: 'namaIbu', label: 'Nama Ibu Kandung', placeholder: 'Nama Ibu sesuai KTP', required: true }
    ]
  },
  SURAT_KUASA: {
    id: 'SURAT_KUASA',
    code: '180',
    title: 'Surat Kuasa (Pelimpahan Wewenang)',
    shortTitle: 'Surat Kuasa',
    badgeClass: 'cat-lainnya',
    icon: 'fa-file-signature',
    categoryGroup: 'rekomendasi',
    desc: 'Surat kuasa pengesahan desa atas pelimpahan wewenang perurusan dokumen/administrasi.',
    syarat: [
      'Fotokopi KTP Pemberi Kuasa',
      'Fotokopi KTP Penerima Kuasa',
      'Surat Pengantar RT/RW Setempat'
    ],
    fields: [
      { name: 'penerimaKuasaNama', label: 'Nama Penerima Kuasa', placeholder: 'Nama lengkap penerima kuasa', required: true },
      { name: 'penerimaKuasaNik', label: 'NIK Penerima Kuasa', placeholder: '16 digit NIK', required: true, isNik: true },
      { name: 'penerimaKuasaAlamat', label: 'Alamat Penerima Kuasa', placeholder: 'Alamat lengkap penerima kuasa', required: true },
      { name: 'tujuanKuasa', label: 'Wewenang / Hal Yang Dikuasakan', type: 'textarea', placeholder: 'Misal: Untuk mengurus dan mengambil sertifikat tanah / dokumen di Bank BRI', required: true }
    ]
  },
  DTSEN_DTKS: {
    id: 'DTSEN_DTKS',
    code: '460.1',
    title: 'Surat Keterangan DTSEN / Terdaftar DTKS Kemensos',
    shortTitle: 'Surat DTSEN / DTKS',
    badgeClass: 'cat-sktm',
    icon: 'fa-database',
    categoryGroup: 'bantuan',
    desc: 'Keterangan resmi bahwa warga terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS / DTSEN Kemensos) desil prasejahtera.',
    syarat: [
      'Fotokopi KTP Kepala Keluarga & Pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Cek ID DTKS / Kartu KKS / PKH / BPNT (jika ada)'
    ],
    fields: [
      { name: 'idDtks', label: 'ID DTKS / Nomor Kartu Keluarga Sejahtera', placeholder: 'Misal: 321104... / Terdaftar DTKS Desil 1', required: true },
      { name: 'jenisBantuanAktif', label: 'Status Program Bantuan Sosial', placeholder: 'Misal: Penerima PKH / BPNT / PBI APBN', required: true },
      { name: 'tujuanDtsen', label: 'Peruntukan Dokumen Keterangan', placeholder: 'Misal: Persyaratan Pengajuan KIP Kuliah / Bantuan Rumah Swadaya', required: true }
    ]
  },
  PDAM_TELEPON: {
    id: 'PDAM_TELEPON',
    code: '540',
    title: 'Surat Keterangan Pemasangan PDAM / Telepon / Listrik PLN',
    shortTitle: 'Pemasangan PDAM/Telepon',
    badgeClass: 'cat-sku',
    icon: 'fa-faucet-drip',
    categoryGroup: 'usaha',
    desc: 'Keterangan permohonan rekomendasi pemasangan baru instalasi PDAM, Telepon/Indihome, atau Listrik PLN.',
    syarat: [
      'Fotokopi KTP & KK Pemohon',
      'Fotokopi Bukti Kepemilikan Bangunan / Rumah / SPPT PBB',
      'Surat Pengantar RT/RW Setempat'
    ],
    fields: [
      { name: 'jenisInstalasi', label: 'Jenis Instalasi Pengajuan', placeholder: 'Misal: Sambungan Baru Air Minum PDAM / Pasang Listrik PLN 900 VA', required: true },
      { name: 'lokasiPasang', label: 'Lokasi Tempat Pemasangan', placeholder: 'Misal: Rumah Tinggal / Bangunan Kp. Tanjungsari RT 01 RW 04', required: true },
      { name: 'perusahaanTujuan', label: 'Instansi / Perusahaan Tujuan', placeholder: 'Misal: Perumda Tirta Sukapura / PT Telkom / PT PLN (Persero)', required: true }
    ]
  },
  PEMAKAMAN: {
    id: 'PEMAKAMAN',
    code: '474.9',
    title: 'Surat Keterangan Pemakaman / Izin TPU Desa',
    shortTitle: 'Keterangan Pemakaman',
    badgeClass: 'cat-kematian',
    icon: 'fa-cross',
    categoryGroup: 'nikah_kematian',
    desc: 'Surat izin/keterangan pemakaman jenazah warga di Tempat Pemakaman Umum (TPU) Desa Tanjungsari.',
    syarat: [
      'Surat Keterangan Kematian dari Dokter/Rumah Sakit/RT',
      'Fotokopi KTP & KK Almarhum/ah',
      'Fotokopi KTP Pelapor'
    ],
    fields: [
      { name: 'namaJenazah', label: 'Nama Almarhum / Almarhumah', placeholder: 'Nama jenazah sesuai KTP', required: true },
      { name: 'tglWaktuPemakaman', label: 'Tanggal & Waktu Pemakaman', placeholder: 'Misal: Selasa, 11 Agustus 2026 (Pukul 10.00 WIB)', required: true },
      { name: 'tpuTujuan', label: 'Nama TPU / Pemakaman Tujuan', placeholder: 'Misal: TPU Muslimin Sukahening Tanjungsari', required: true }
    ]
  },
  SUDAH_NIKAH: {
    id: 'SUDAH_NIKAH',
    code: '474.2',
    title: 'Surat Keterangan Sudah Menikah',
    shortTitle: 'Keterangan Sudah Menikah',
    badgeClass: 'cat-nikah',
    icon: 'fa-ring',
    categoryGroup: 'nikah_kematian',
    desc: 'Keterangan resmi desa mengenai status pasangan suami istri yang telah sah menikah.',
    syarat: [
      'Fotokopi KTP & KK Suami Istri',
      'Fotokopi Buku Nikah / Keterangan Pembantu PPN / RT',
      'Pas Foto Berdampingan 4x6 (2 lembar)'
    ],
    fields: [
      { name: 'namaPasanganSuamiIstri', label: 'Nama Suami / Istri Pasangan', placeholder: 'Nama pasangan suami/istri', required: true },
      { name: 'tglTahunNikah', label: 'Tanggal / Tahun Pernikahan', placeholder: 'Misal: 12 Mei 2018', required: true },
      { name: 'tempatNikah', label: 'Tempat / Lokasi Akad Nikah', placeholder: 'Misal: Desa Tanjungsari, Kec. Salawu', required: true }
    ]
  },
  STATUS_JANDA: {
    id: 'STATUS_JANDA',
    code: '470',
    title: 'Surat Keterangan Status Janda / Duda',
    shortTitle: 'Status Janda / Duda',
    badgeClass: 'cat-domisili',
    icon: 'fa-person-half-dress',
    categoryGroup: 'kependudukan',
    desc: 'Surat keterangan resmi status perkawinan Janda / Duda (Cerai Mati / Cerai Hidup).',
    syarat: [
      'Fotokopi KTP & KK Pemohon',
      'Fotokopi Akta Cerai (Cerai Hidup) / Surat Kematian Pasangan (Cerai Mati)',
      'Surat Pengantar RT/RW Setempat'
    ],
    fields: [
      { name: 'statusPernikahanDetil', label: 'Status Spesifik (Janda/Duda)', placeholder: 'Misal: Janda (Cerai Mati) / Duda (Cerai Hidup)', required: true },
      { name: 'namaMantanPasangan', label: 'Nama Almarhum Suami/Istri atau Mantan', placeholder: 'Nama suami/istri terdahulu', required: true },
      { name: 'nomorDokumenCeraiMati', label: 'Nomor Akta Cerai / Surat Kematian', placeholder: 'Misal: Akta Cerai No. 0412/AC/2022/PA.Smd atau Surat Kematian No. 474/011', required: true }
    ]
  }
};

// Seed Initial Records Data for Realistic Demonstration
const SEED_RECORDS = [
  {
    id: 'TRX-4918-SKTMPBIBPJS',
    noSurat: '440.2/018/DS-TS/VIII/2026',
    nik: '3211042506830007',
    nama: 'Endang Suherman',
    tmpLahir: 'Tasikmalaya',
    tglLahir: '1983-06-25',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Buruh Lepas',
    alamat: 'Dusun Tanjungsari RT 02 RW 01',
    kategori: 'SKTM_PBI_BPJS',
    keperluan: 'Pengusulan Pendaftaran Kepesertaan BPJS Kesehatan PBI APBD (Gratis)',
    spesifik: {
      jenisPengusulan: 'Pendaftaran BPJS PBI APBD Baru',
      faskesTujuan: 'Puskesmas Salawu Kabupaten Tasikmalaya',
      noBpjsLama: '-'
    },
    tglTerbit: '2026-08-10',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4915-SKTMUPCK',
    noSurat: '440.1/017/DS-TS/VIII/2026',
    nik: '3211041503790005',
    nama: 'Herman Permana',
    tmpLahir: 'Tasikmalaya',
    tglLahir: '1979-03-15',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Buruh Tani',
    alamat: 'Dusun Langkob RT 03 RW 02',
    kategori: 'SKTM_UPCK',
    keperluan: 'Pengajuan Jaminan Pelayanan Kesehatan Desa & Rekomendasi Penanggulangan Kemiskinan (UPCK)',
    spesifik: {
      namaPasienWarga: 'Herman Permana (Diri Sendiri)',
      tujuanUpck: 'Dinas Kesehatan / UPCK & RSUD SMC Tasikmalaya',
      keperluanUpck: 'Permohonan Jaminan Pelayanan Kesehatan Rawat Inap'
    },
    tglTerbit: '2026-08-09',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4912-SKTMPERCERAIAN',
    noSurat: '460/016/DS-TS/VIII/2026',
    nik: '3211046208940001',
    nama: 'Nani Sumarni',
    tmpLahir: 'Tasikmalaya',
    tglLahir: '1994-08-22',
    jk: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Mengurus Rumah Tangga',
    alamat: 'Dusun Margaluyu RT 03 RW 01',
    kategori: 'SKTM_PERCERAIAN',
    keperluan: 'Permohonan Pembebasan Biaya Perkara (Prodeo) Gugatan Cerai di Pengadilan Agama',
    spesifik: {
      pihakLawan: 'Jaka Permana (Tergugat / Suami)',
      pengadilanTujuan: 'Pengadilan Agama Singaparna Kabupaten Tasikmalaya',
      tujuanProdeo: 'Persyaratan Layanan Bantuan Hukum & Pembebasan Biaya Perkara (Prodeo)'
    },
    tglTerbit: '2026-08-08',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4910-SKTMPELAJAR',
    noSurat: '460/015/DS-TS/VIII/2026',
    nik: '3211045012050003',
    nama: 'Rina Nurbaeti',
    tmpLahir: 'Tasikmalaya',
    tglLahir: '2005-12-10',
    jk: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Pelajar / Mahasiswa',
    alamat: 'Dusun Langkob RT 01 RW 02',
    kategori: 'SKTM_PELAJAR',
    keperluan: 'Pengajuan Beasiswa Pendidikan KIP Kuliah / Keringanan Biaya UKT',
    spesifik: {
      namaSiswa: 'Rina Nurbaeti (Anak Kandung H. Sobar)',
      namaSekolah: 'Universitas Siliwangi (UNSIL) Tasikmalaya',
      kelasJurusan: 'Semester 3 / Program Studi Pendidikan Bahasa Inggris',
      tujuanBeasiswa: 'Persyaratan Registrasi Beasiswa KIP Kuliah Pemkab Tasikmalaya'
    },
    tglTerbit: '2026-08-07',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4908-SKTMUMUM',
    noSurat: '460/014/DS-TS/VIII/2026',
    nik: '3211041003750009',
    nama: 'Asep Saepudin',
    tmpLahir: 'Tasikmalaya',
    tglLahir: '1978-04-12',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Buruh Harian Lepas',
    alamat: 'Dusun Sukamaju RT 02 RW 03',
    kategori: 'SKTM_UMUM',
    keperluan: 'Pengajuan Keringanan Biaya Administrasi & Permohonan Bantuan Sosial Desa',
    spesifik: {
      tujuanUmum: 'Permohonan Bantuan Sosial & Keringanan Beban Ekonomi Keluarga',
      jumlahTanggungan: '4 Orang (1 Istri, 3 Anak)',
      statusKeluarga: 'Keluarga Kurang Mampu (Terdaftar DTKS Desil 1)'
    },
    tglTerbit: '2026-08-06',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4905-UPCPK',
    noSurat: '440/013/DS-TS/VIII/2026',
    nik: '3211041807850002',
    nama: 'Dadang Hendra',
    tmpLahir: 'Tasikmalaya',
    tglLahir: '1985-07-18',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Buruh Tani',
    alamat: 'Dusun Langkob RT 04 RW 01',
    kategori: 'UPCPK',
    keperluan: 'Pengajuan Jaminan Pelayanan Kesehatan / UPCPK Rawat Inap RSUD',
    spesifik: {
      namaPasien: 'Dadang Hendra (Diri Sendiri)',
      hubunganPasien: 'Diri Sendiri',
      namaRumahSakit: 'RSUD SMC Kabupaten Tasikmalaya',
      diagnosaPenyakit: 'Pengobatan Layanan Rawat Inap Spesialis'
    },
    tglTerbit: '2026-08-05',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4901-SKU',
    noSurat: '470/012/DS-TS/VIII/2026',
    nik: '3211041508820001',
    nama: 'Suparman',
    tmpLahir: 'Sumedang',
    tglLahir: '1982-08-15',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Wiraswasta',
    alamat: 'Dusun Tanjungsari RT 01 RW 04',
    kategori: 'SKU',
    keperluan: 'Persyaratan Pengajuan Kredit Usaha Bank Mandiri',
    spesifik: {
      namaUsaha: 'Toko Kelontong Suparman Jaya',
      jenisUsaha: 'Perdagangan Sembako & Bahan Pokok',
      lokasiUsaha: 'Jl. Raya Tanjungsari No. 12 RT 01 RW 04',
      tahunBerdiri: '2018'
    },
    tglTerbit: '2026-08-04',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4899-SKTM',
    noSurat: '460/011/DS-TS/VIII/2026',
    nik: '3211042003750004',
    nama: 'Budi Santoso',
    tmpLahir: 'Bandung',
    tglLahir: '1975-03-20',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Buruh Harian Lepas',
    alamat: 'Dusun Sukamaju RT 03 RW 02',
    kategori: 'SKTM',
    keperluan: 'Pengajuan Keringanan Biaya Rumah Sakit Umum Sumedang',
    spesifik: {
      namaAnak: 'Budi Santoso (Diri Sendiri)',
      tujuanSktm: 'Pengobatan Rawat Inap RSUD Sumedang'
    },
    tglTerbit: '2026-08-03',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4892-NIKAH',
    noSurat: '474.2/010/DS-TS/VIII/2026',
    nik: '3211045211980003',
    nama: 'Siti Aminah',
    tmpLahir: 'Sumedang',
    tglLahir: '1998-11-12',
    jk: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Karyawan Swasta',
    alamat: 'Dusun Margaluyu RT 02 RW 01',
    kategori: 'NIKAH',
    keperluan: 'Persyaratan Administrasi Pendaftaran Nikah di KUA Tanjungsari',
    spesifik: {
      namaPasangan: 'Ahmad Budi',
      binBintiPasangan: 'Bin H. Abdullah',
      alamatPasangan: 'Kecamatan Jatinangor, Sumedang'
    },
    tglTerbit: '2026-08-02',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4885-DOMISILI',
    noSurat: '470/009/DS-TS/VII/2026',
    nik: '3211041005900002',
    nama: 'Dadang Hidayat',
    tmpLahir: 'Majalengka',
    tglLahir: '1990-05-10',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'PNS / ASN',
    alamat: 'Dusun Tanjungsari RT 04 RW 05',
    kategori: 'DOMISILI',
    keperluan: 'Persyaratan Pembukaan Rekening Bank BJB & Domisili Usaha',
    spesifik: {
      sejakTanggal: 'Tahun 2016',
      statusTempatTinggal: 'Milik Sendiri'
    },
    tglTerbit: '2026-07-29',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4880-KEMATIAN',
    noSurat: '474/008/DS-TS/VII/2026',
    nik: '3211040101450001',
    nama: 'Hj. Ratna Sukarsih',
    tmpLahir: 'Sumedang',
    tglLahir: '1945-01-01',
    jk: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Mengurus Rumah Tangga',
    alamat: 'Dusun Cikuda RT 01 RW 03',
    kategori: 'KEMATIAN',
    keperluan: 'Pengurusan Klaim Asuransi Kematian & Taspen',
    spesifik: {
      namaAlmarhum: 'Hj. Ratna Sukarsih',
      nikAlmarhum: '3211040101450001',
      tglMeninggal: '2026-07-27',
      tempatMeninggal: 'Kediaman Duka Dusun Cikuda',
      sebabMeninggal: 'Sakit Usia Lanjut'
    },
    tglTerbit: '2026-07-28',
    petugas: 'Admin Desa'
  },
  {
    id: 'TRX-4874-SKU',
    noSurat: '470/007/DS-TS/VII/2026',
    nik: '3211042504880005',
    nama: 'Cecep Mulyana',
    tmpLahir: 'Sumedang',
    tglLahir: '1988-04-25',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Wiraswasta',
    alamat: 'Dusun Sukamaju RT 02 RW 02',
    kategori: 'SKU',
    keperluan: 'Permohonan Izin Usaha Perdagangan & NIB',
    spesifik: {
      namaUsaha: 'Bengkel Sepeda Motor Mulyana',
      jenisUsaha: 'Jasa Servis & Penjualan Sparepart',
      lokasiUsaha: 'Dusun Sukamaju RT 02 RW 02',
      tahunBerdiri: '2021'
    },
    tglTerbit: '2026-07-25',
    petugas: 'Admin Desa'
  }
];

const SEED_ACTIVITIES = [
  { text: 'Surat SKU Dicetak untuk Suparman', time: '2 menit lalu' },
  { text: 'Permintaan Domisili oleh Dadang Hidayat', time: '15 menit lalu' },
  { text: 'SKTM Disetujui untuk Budi Santoso', time: '1 jam lalu' },
  { text: 'Surat Pengantar Nikah diterbitkan', time: '3 jam lalu' },
  { text: 'Pencatatan Surat Kematian Hj. Ratna Sukarsih', time: '1 hari lalu' }
];

// Data Store Manager
class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(SEED_RECORDS));
    }

    // Always merge and update settings to ensure latest village profile info
    const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    const updatedSettings = {
      ...DEFAULT_VILLAGE_SETTINGS,
      ...currentSettings,
      namaKades: 'ATEP ABDUL CHOLIK',
      nipKades: '-',
      alamat: 'Jl. Raya Tasikmalaya-Garut KM. 34 Kp. Langkob RT 004 RW 001',
      telepon: '+62 899-9273-848',
      email: 'desatanjungsarisalawu@gmail.com'
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));

    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    }
  }

  getRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS)) || [];
    } catch (e) {
      return SEED_RECORDS;
    }
  }

  saveRecord(record) {
    const records = this.getRecords();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));

    // Log activity
    this.logActivity(`Surat ${record.kategori} diterbitkan untuk ${record.nama}`, 'Baru saja');
    return record;
  }

  deleteRecord(id) {
    let records = this.getRecords();
    records = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_VILLAGE_SETTINGS;
    } catch (e) {
      return DEFAULT_VILLAGE_SETTINGS;
    }
  }

  saveSettings(newSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  }

  getActivities() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) || SEED_ACTIVITIES;
    } catch (e) {
      return SEED_ACTIVITIES;
    }
  }

  logActivity(text, time = 'Baru saja') {
    const activities = this.getActivities();
    activities.unshift({ text, time });
    if (activities.length > 8) activities.pop();
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }

  // Get dynamic summary counts for stats cards
  getStats() {
    const records = this.getRecords();
    const stats = {
      SKU: 0,
      SKTM: 0,
      SKTM_UMUM: 0,
      SKTM_PELAJAR: 0,
      SKTM_PERCERAIAN: 0,
      SKTM_UPCK: 0,
      SKTM_PBI_BPJS: 0,
      UPCPK: 0,
      KEMATIAN: 0,
      NIKAH: 0,
      DOMISILI: 0,
      PINDAH_DATANG: 0,
      PINDAH_KELUAR: 0,
      LETTER_C_BANK: 0,
      NA_NIKAH: 0,
      TAKSIRAN_TANAH: 0,
      KETERANGAN_KERJA: 0,
      IZIN_KERAMAIAN: 0,
      SURAT_KUASA: 0,
      DTSEN_DTKS: 0,
      AHLI_WARIS: 0,
      PDAM_TELEPON: 0,
      PEMAKAMAN: 0,
      BEDA_NAMA: 0,
      BELUM_NIKAH: 0,
      SUDAH_NIKAH: 0,
      STATUS_JANDA: 0,
      LAINNYA: 0,
      total: records.length
    };

    records.forEach(r => {
      if (stats[r.kategori] !== undefined) {
        stats[r.kategori]++;
      } else {
        stats.LAINNYA++;
      }
    });

    return stats;
  }

  // Get combined list of default LETTER_TYPES and custom user templates
  getTemplates() {
    let customTemplates = {};
    try {
      customTemplates = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES)) || {};
    } catch (e) {
      customTemplates = {};
    }
    return { ...LETTER_TYPES, ...customTemplates };
  }

  // Save or Update a Custom Template
  saveCustomTemplate(template) {
    let customTemplates = {};
    try {
      customTemplates = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES)) || {};
    } catch (e) {
      customTemplates = {};
    }

    const templateId = template.id || `CUSTOM_${Date.now()}`;
    template.id = templateId;

    if (!template.badgeClass) template.badgeClass = 'cat-lainnya';
    if (!template.icon) template.icon = 'fa-file-signature';
    if (!template.categoryGroup) template.categoryGroup = 'rekomendasi';
    if (!template.syarat) template.syarat = ['Fotokopi KTP Pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat Pengantar RT/RW Setempat'];

    customTemplates[templateId] = template;
    LETTER_TYPES[templateId] = template; // Sync in-memory configuration
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(customTemplates));
    this.logActivity(`Template ${template.shortTitle || template.title} diperbarui`, 'Baru saja');
    return template;
  }

  // Delete a Custom Template
  deleteCustomTemplate(templateId) {
    let customTemplates = {};
    try {
      customTemplates = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES)) || {};
    } catch (e) {
      customTemplates = {};
    }

    if (customTemplates[templateId]) {
      delete customTemplates[templateId];
      delete LETTER_TYPES[templateId];
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(customTemplates));
      this.logActivity(`Template custom ${templateId} dihapus`, 'Baru saja');
    }
  }

  // Reset to Default Village Templates
  resetTemplatesToDefault() {
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
  }

  // Export current database state to JSON format
  exportJSON() {
    const data = {
      appName: "Sistem Pengarsipan Administrasi Desa Tanjungsari",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      records: this.getRecords(),
      activities: this.getActivities()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_desatanjungsari_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Export current database to MySQL SQL script format
  exportSQL() {
    const settings = this.getSettings();
    const records = this.getRecords();
    const activities = this.getActivities();

    let sql = `-- DATABASE BACKUP DESA TANJUNGSARI\n-- Exported: ${new Date().toLocaleString()}\n\n`;
    sql += `CREATE DATABASE IF NOT EXISTS \`db_pengarsipan_desatanjungsari\` DEFAULT CHARACTER SET utf8mb4;\nUSE \`db_pengarsipan_desatanjungsari\`;\n\n`;

    // Table settings
    sql += `-- 1. PENGATURAN DESA\nDROP TABLE IF EXISTS \`tb_pengaturan_desa\`;\n`;
    sql += `CREATE TABLE \`tb_pengaturan_desa\` (\n  \`id\` INT PRIMARY KEY,\n  \`kabupaten\` VARCHAR(100),\n  \`kecamatan\` VARCHAR(100),\n  \`desa\` VARCHAR(100),\n  \`alamat\` TEXT,\n  \`kode_pos\` VARCHAR(10),\n  \`email\` VARCHAR(100),\n  \`telepon\` VARCHAR(30),\n  \`nama_kades\` VARCHAR(100),\n  \`nip_kades\` VARCHAR(50),\n  \`jabatan_penandatangan\` VARCHAR(100)\n);\n\n`;
    sql += `INSERT INTO \`tb_pengaturan_desa\` VALUES (1, '${settings.kabupaten.replace(/'/g, "''")}', '${settings.kecamatan.replace(/'/g, "''")}', '${settings.desa.replace(/'/g, "''")}', '${settings.alamat.replace(/'/g, "''")}', '${settings.kodePos}', '${settings.email}', '${settings.telepon}', '${settings.namaKades.replace(/'/g, "''")}', '${settings.nipKades}', '${settings.jabatanPenandatangan.replace(/'/g, "''")}');\n\n`;

    // Table records
    sql += `-- 2. ARSIP SURAT\nDROP TABLE IF EXISTS \`tb_arsip_surat\`;\n`;
    sql += `CREATE TABLE \`tb_arsip_surat\` (\n  \`id\` VARCHAR(50) PRIMARY KEY,\n  \`no_surat\` VARCHAR(100),\n  \`nik\` VARCHAR(20),\n  \`nama\` VARCHAR(100),\n  \`tmp_lahir\` VARCHAR(50),\n  \`tgl_lahir\` DATE,\n  \`jk\` VARCHAR(20),\n  \`agama\` VARCHAR(30),\n  \`pekerjaan\` VARCHAR(100),\n  \`alamat\` TEXT,\n  \`kategori\` VARCHAR(20),\n  \`keperluan\` TEXT,\n  \`data_spesifik\` JSON,\n  \`tgl_terbit\` DATE,\n  \`petugas\` VARCHAR(100)\n);\n\n`;

    records.forEach(r => {
      const specJson = JSON.stringify(r.spesifik || {}).replace(/'/g, "''");
      sql += `INSERT INTO \`tb_arsip_surat\` VALUES ('${r.id}', '${r.noSurat}', '${r.nik}', '${r.nama.replace(/'/g, "''")}', '${(r.tmpLahir||'').replace(/'/g, "''")}', '${r.tglLahir}', '${r.jk}', '${r.agama}', '${(r.pekerjaan||'').replace(/'/g, "''")}', '${r.alamat.replace(/'/g, "''")}', '${r.kategori}', '${r.keperluan.replace(/'/g, "''")}', '${specJson}', '${r.tglTerbit}', '${r.petugas}');\n`;
    });

    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_desatanjungsari_${new Date().toISOString().slice(0,10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import JSON object into DataStore
  importJSON(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') throw new Error('Format file JSON tidak valid.');
    if (jsonData.records && Array.isArray(jsonData.records)) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(jsonData.records));
    }
    if (jsonData.settings && typeof jsonData.settings === 'object') {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(jsonData.settings));
    }
    if (jsonData.activities && Array.isArray(jsonData.activities)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(jsonData.activities));
    }
    this.logActivity('Database berhasil diimpor', 'Baru saja');
    return true;
  }
}

window.dataStore = new DataStore();

