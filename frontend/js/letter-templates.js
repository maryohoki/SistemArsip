/**
 * Official Indonesian Village Letter Generator (Naskah Dinas Desa Tanjungsari)
 */

function formatDateIndonesian(dateString) {
  if (!dateString) return '-';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parts[0];
  const month = months[parseInt(parts[1], 10) - 1];
  const day = parseInt(parts[2], 10);
  return `${day} ${month} ${year}`;
}

function generateLetterHTML(record, settings) {
  const v = settings || window.dataStore.getSettings();
  const r = record;
  const tglTerbitFormatted = formatDateIndonesian(r.tglTerbit || new Date().toISOString().split('T')[0]);
  const tglLahirFormatted = formatDateIndonesian(r.tglLahir);

  // Generate QR Code data URL dynamically using Canvas API
  const qrVerificationText = `VERIFIED-DESA-TANJUNGSARI-${r.noSurat}-${r.nik}`;

  let specificDetailsHTML = '';
  let letterTitle = 'SURAT KETERANGAN';

  // Construct specific body based on letter type
  switch (r.kategori) {
    case 'LAINNYA':
      letterTitle = r.spesifik?.judulSurat || 'SURAT KETERANGAN';
      specificDetailsHTML = `
        <p class="letter-opening-text" style="white-space: pre-wrap;">
          ${r.spesifik?.isiSurat || 'Bahwa yang bersangkutan merupakan warga Desa Tanjungsari.'}
        </p>
      `;
      break;

    case 'SKU':
      letterTitle = 'SURAT KETERANGAN USAHA (SKU)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar penduduk berdomisili di Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan pengamatan kami, yang bersangkutan benar memiliki dan menjalankan kegiatan usaha sebagai berikut:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Usaha / Toko</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaUsaha || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Jenis / Bidang Usaha</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.jenisUsaha || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Lokasi Usaha</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.lokasiUsaha || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Lama Usaha Berjalan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tahunBerdiri || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Usaha ini diterbitkan atas dasar yang sebenarnya untuk dapat dipergunakan sebagai <strong>${r.keperluan || 'Persyaratan Administrasi'}</strong>.
        </p>
      `;
      break;

    case 'SKTM':
      letterTitle = 'SURAT KETERANGAN TIDAK MAMPU (SKTM) PENDIDIKAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar warga penduduk Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan data kependudukan dan verifikasi di lapangan, keluarga yang bersangkutan dikategorikan dalam <strong>Keluarga Kurang Mampu / Ekonomi Lemah</strong>.
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Siswa / Mahasiswa</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaAnak || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Sekolah / Perguruan Tinggi</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tujuanSktm || r.keperluan || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat Keterangan ini diberikan untuk dipergunakan sebagai <strong>${r.keperluan || 'Persyaratan Beasiswa / Keringanan Biaya Pendidikan'}</strong>.
        </p>
      `;
      break;

    case 'SKTM_UMUM':
      letterTitle = 'SURAT KETERANGAN TIDAK MAMPU (SKTM) UMUM';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar warga penduduk berdomisili di Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan data kependudukan, basis data DTKS, serta verifikasi faktual di lapangan, keluarga yang bersangkutan benar dikategorikan dalam <strong>Keluarga Kurang Mampu / Ekonomi Lemah / Prasejahtera</strong>.
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Tujuan / Peruntukan SKTM</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.tujuanUmum || r.keperluan || 'Keperluan Umum / Bantuan Sosial'}</strong></td>
          </tr>
          ${r.spesifik?.jumlahTanggungan ? `
          <tr>
            <td class="label-col">Jumlah Tanggungan Keluarga</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik.jumlahTanggungan}</td>
          </tr>
          ` : ''}
          ${r.spesifik?.statusKeluarga ? `
          <tr>
            <td class="label-col">Keterangan Ekonomi</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik.statusKeluarga}</td>
          </tr>
          ` : ''}
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Tidak Mampu (SKTM) Umum ini diterbitkan atas dasar keadaan yang sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'SKTM_PELAJAR':
      letterTitle = 'SURAT KETERANGAN TIDAK MAMPU (SKTM) PELAJAR / SISWA';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar orang tua/wali dari pelajar/siswa berdomisili di Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan data kependudukan dan verifikasi lapangan, keluarga tersebut tergolong dalam <strong>Keluarga Kurang Mampu / Ekonomi Lemah</strong>.
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Pelajar / Siswa</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaSiswa || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Sekolah / Perguruan Tinggi</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaSekolah || '-'}</strong></td>
          </tr>
          ${r.spesifik?.kelasJurusan ? `
          <tr>
            <td class="label-col">Kelas / Tingkat / Jurusan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik.kelasJurusan}</td>
          </tr>
          ` : ''}
          <tr>
            <td class="label-col">Tujuan / Keperluan SKTM</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tujuanBeasiswa || r.keperluan || 'Pengajuan Beasiswa / KIP Sekolah / Keringanan Biaya'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Tidak Mampu (SKTM) Pelajar ini diterbitkan agar dapat dipergunakan sebagai persyaratan administrasi bantuan pendidikan / beasiswa.
        </p>
      `;
      break;

    case 'SKTM_PERCERAIAN':
      letterTitle = 'SURAT KETERANGAN TIDAK MAMPU (PRODEO PERCERAIAN)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar warga penduduk berdomisili di Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan hasil verifikasi kependudukan dan keadaan ekonomi di lapangan, yang bersangkutan benar-benar tergolong dalam <strong>Keluarga Kurang Mampu / Ekonomi Lemah</strong>.
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Pihak Pasangan / Tergugat</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.pihakLawan || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Pengadilan Tujuan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.pengadilanTujuan || 'Pengadilan Agama'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Maksud / Keperluan Dokumen</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tujuanProdeo || r.keperluan || 'Permohonan Pembebasan Biaya Perkara (Prodeo) Perceraian'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Tidak Mampu ini dibuat dengan sebenarnya untuk dipergunakan sebagai persyaratan permohonan pembebasan biaya perkara (Prodeo) di ${r.spesifik?.pengadilanTujuan || 'Pengadilan Agama'}.
        </p>
      `;
      break;

    case 'SKTM_UPCK':
      letterTitle = 'SURAT KETERANGAN TIDAK MAMPU & REKOMENDASI UPCK';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar warga penduduk berdomisili di Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan hasil verifikasi kependudukan dan basis data penanggulangan kemiskinan desa, keluarga yang bersangkutan dikategorikan dalam <strong>Keluarga Kurang Mampu / Prasejahtera</strong>.
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Pasien / Warga Tanggungan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaPasienWarga || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Instansi / Tujuan UPCK</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.tujuanUpck || 'Dinas Kesehatan / RSUD'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Maksud / Keperluan Layanan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.keperluanUpck || r.keperluan || 'Pengajuan Jaminan Pelayanan Kesehatan & Bantuan Kemiskinan'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Tidak Mampu & Rekomendasi UPCK ini diterbitkan agar dapat dipergunakan sebagaimana mestinya untuk pengurusan layanan Jaminan Pelayanan Kesehatan / Penanggulangan Kemiskinan.
        </p>
      `;
      break;

    case 'SKTM_PBI_BPJS':
      letterTitle = 'SURAT KETERANGAN TIDAK MAMPU (INTEGRASI PBI / BPJS KESEHATAN)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas beserta seluruh anggota keluarganya adalah benar-benar warga berdomisili di Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten}. 
          Berdasarkan hasil verifikasi kependudukan dan verifikasi kondisi sosial ekonomi di lapangan, keluarga tersebut tergolong dalam <strong>Keluarga Kurang Mampu / Prasejahtera</strong> yang berhak mendapatkan jaminan kesehatan gratis.
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Jenis Pengusulan Layanan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.jenisPengusulan || 'Pengusulan BPJS PBI / Jamkesda'}</strong></td>
          </tr>
          ${r.spesifik?.noBpjsLama ? `
          <tr>
            <td class="label-col">Nomor BPJS (Lama/Non-aktif)</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik.noBpjsLama}</td>
          </tr>
          ` : ''}
          <tr>
            <td class="label-col">Faskes Tingkat I (FKTP)</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.faskesTujuan || 'Puskesmas Salawu'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Keperluan Dokumen</td>
            <td class="colon-col">:</td>
            <td>${r.keperluan || 'Persyaratan Pendaftaran / Reaktivasi BPJS PBI (Penerima Bantuan Iuran) APBD/APBN'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Tidak Mampu ini diterbitkan untuk dipergunakan sebagai persyaratan pengusulan pendaftaran / reaktivasi kepesertaan <strong>Penerima Bantuan Iuran (PBI) BPJS Kesehatan</strong> melalui Dinas Sosial & Dinas Kesehatan.
        </p>
      `;
      break;

    case 'PINDAH_DATANG':
      letterTitle = 'SURAT KETERANGAN PINDAH DATANG WNI';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan bahwa nama tersebut di atas benar telah mendaftarkan kepindahan kedatangannya sebagai warga WNI berdomisili di Desa Tanjungsari dengan rincian:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Alamat Daerah Asal</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.alamatAsal || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Alamat Tujuan Tanjungsari</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.alamatTujuan || r.alamat}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Jumlah Anggota Keluarga</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.jumlahPengikut || '1 Orang'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat Keterangan ini diterbitkan untuk pengurusan administrasi pendaftaran penduduk dan penerbitan Kartu Keluarga (KK) baru di Desa Tanjungsari.
        </p>
      `;
      break;

    case 'PINDAH_KELUAR':
      letterTitle = 'SURAT KETERANGAN PINDAH WNI (KELUAR)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan bahwa orang tersebut di atas adalah benar warga Desa Tanjungsari dan bermaksud memohon SKPWNI Pindah Keluar ke daerah domisili baru:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Alamat Tujuan Kepindahan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.alamatTujuanPindah || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Alasan Kepindahan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.alasanPindah || r.keperluan || 'Mengikuti Keluarga / Pekerjaan'}</td>
          </tr>
          ${r.spesifik?.pengikutPindah ? `
          <tr>
            <td class="label-col">Daftar Keluarga Ikut Pindah</td>
            <td class="colon-col">:</td>
            <td><div style="white-space:pre-line;">${r.spesifik.pengikutPindah}</div></td>
          </tr>
          ` : ''}
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Pindah WNI ini dibuat untuk dipergunakan sebagai pengantar ke Dinas Kependudukan dan Pencatatan Sipil.
        </p>
      `;
      break;

    case 'LETTER_C_BANK':
      letterTitle = 'SURAT KETERANGAN KEPEMILIKAN TANAH (LETTER C / BANK)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan bahwa berdasarkan Buku Register Tanah Desa Tanjungsari (Letter C), nama tersebut di atas adalah benar pemilik/penggarap sah atas bidang tanah:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nomor Kohir / Persil C</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.nomorPersilC || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Luas Bidang Tanah</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.luasTanahC || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Lembaga / Bank Tujuan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.bankTujuan || 'Bank / Lembaga Keuangan'}</strong></td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Tanah tersebut tidak sedang dalam sengketa dan tidak dalam jaminan pihak lain. Surat Keterangan ini diterbitkan untuk permohonan kredit/pinjaman di <strong>${r.spesifik?.bankTujuan || 'Bank'}</strong>.
        </p>
      `;
      break;

    case 'NA_NIKAH':
      letterTitle = 'SURAT KETERANGAN UNTUK NIKAH (FORMULIR NA / N1-N6)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah warga desa kami yang akan melaksanakan akad nikah dengan calon pasangan:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Calon Pasangan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaPasanganNa || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Bin / Binti Pasangan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.binPasanganNa || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">KUA Tujuan Pemeriksaan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.kuaTujuan || 'KUA Kecamatan Salawu'}</strong></td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat Pengantar NA ini diterbitkan untuk memenuhi persyaratan pemeriksaan nikah di Kantor Urusan Agama (KUA).
        </p>
      `;
      break;

    case 'TAKSIRAN_TANAH':
      letterTitle = 'SURAT KETERANGAN HARGA TAKSIRAN TANAH & BANGUNAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan bahwa berdasarkan pengamatan lokasi dan taksiran pasaran wajar di wilayah Desa Tanjungsari, bidang tanah/bangunan milik pemohon:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Lokasi / Blok Tanah</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.lokasiBumi || r.alamat}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Luas Tanah / Bangunan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.luasBumi || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Taksiran Pasaran m²</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.hargaPerMeter || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Total Estimasi Taksiran</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.totalTaksiran || '-'}</strong></td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Harga Taksiran Tanah ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'KETERANGAN_KERJA':
      letterTitle = 'SURAT KETERANGAN PEKERJAAN / MATA PENCAHARIAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan bahwa orang tersebut di atas adalah benar warga Desa Tanjungsari yang saat ini bekerja/memiliki mata pencaharian sebagai:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Jenis Pekerjaan / Profesi</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.jenisPekerjaanAktual || r.pekerjaan}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Tempat / Lokasi Bekerja</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.lokasiKerja || 'Desa Tanjungsari & Sekitarnya'}</td>
          </tr>
          <tr>
            <td class="label-col">Peruntukan Surat</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.keperluanSuratKerja || r.keperluan || 'Persyaratan Administrasi'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat Keterangan Pekerjaan ini dibuat atas dasar keadaan yang sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'IZIN_KERAMAIAN':
      letterTitle = 'SURAT PENGANTAR / REKOMENDASI IZIN KERAMAIAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} memberikan pengantar/rekomendasi izin penyelenggaraan acara keramaian masyarakat kepada pemohon:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama / Jenis Kegiatan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaAcara || r.keperluan}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Waktu Pelaksanaan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.tglWaktuAcara || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Tempat / Lokasi Acara</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.lokasiAcara || r.alamat}</td>
          </tr>
          ${r.spesifik?.hiburanBintang ? `
          <tr>
            <td class="label-col">Jenis Hiburan / Pengisi</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik.hiburanBintang}</td>
          </tr>
          ` : ''}
        </table>
        <p class="letter-opening-text">
          Penyelenggara wajib menjaga ketertiban, keamanan, dan kebersihan lokasi acara. Surat ini diterbitkan sebagai pengantar ke Kepolisian Sektor (Polsek Salawu).
        </p>
      `;
      break;

    case 'SURAT_KUASA':
      letterTitle = 'SURAT KUASA (PELIMPAHAN WEWENANG)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Yang bertanda tangan di bawah ini (Pemberi Kuasa): <strong>${r.nama}</strong> (NIK: ${r.nik}) memberikan kuasa penuh kepada:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Penerima Kuasa</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.penerimaKuasaNama || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">NIK Penerima Kuasa</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.penerimaKuasaNik || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Alamat Penerima Kuasa</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.penerimaKuasaAlamat || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          <strong>Hal / Wewenang Yang Dikuasakan:</strong><br>
          ${r.spesifik?.tujuanKuasa || r.keperluan || 'Mengurus permohonan administrasi dan dokumen di instansi terkait.'}
        </p>
        <p class="letter-opening-text">
          Demikian Surat Kuasa ini dibuat atas kesadaran bersama tanpa ada paksaan dari pihak manapun untuk dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'DTSEN_DTKS':
      letterTitle = 'SURAT KETERANGAN DTSEN / TERDAFTAR DTKS KEMENSOS';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} menerangkan bahwa orang tersebut di atas adalah benar warga Desa Tanjungsari yang terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS / DTSEN Kemensos RI):
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">ID DTKS / KKS</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.idDtks || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Status Bansos Aktif</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.jenisBantuanAktif || 'PKH / BPNT / PBI APBN'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Keperluan Dokumen</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tujuanDtsen || r.keperluan || 'Persyaratan Pengajuan Bantuan Sosial / Pendidikan KIP'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Terdaftar DTKS ini diterbitkan agar dapat dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'PDAM_TELEPON':
      letterTitle = 'SURAT REKOMENDASI PEMASANGAN PDAM / TELEPON / PLN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari memberikan surat pengantar/rekomendasi permohonan pemasangan instalasi baru kepada pemohon:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Jenis Instalasi Baru</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.jenisInstalasi || 'Sambungan Baru Air PDAM / PLN'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Lokasi Pemasangan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.lokasiPasang || r.alamat}</td>
          </tr>
          <tr>
            <td class="label-col">Instansi / Perusahaan Tujuan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.perusahaanTujuan || 'Perumda Tirta Sukapura / PT PLN'}</strong></td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Rekomendasi Pemasangan ini dibuat untuk memenuhi persyaratan permohonan ke pihak penyedia layanan.
        </p>
      `;
      break;

    case 'PEMAKAMAN':
      letterTitle = 'SURAT KETERANGAN PEMAKAMAN / IZIN TPU DESA';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari menerangkan bahwa telah dilaksanakan/diizinkan pemakaman jenazah warga di Tempat Pemakaman Umum (TPU) Desa Tanjungsari:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Almarhum / Almarhumah</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaJenazah || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Waktu Pemakaman</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tglWaktuPemakaman || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">TPU Pemakaman Tujuan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.tpuTujuan || 'TPU Desa Tanjungsari'}</strong></td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Pemakaman ini diterbitkan untuk dipergunakan sebagai kelengkapan administrasi pemakaman desa.
        </p>
      `;
      break;

    case 'SUDAH_NIKAH':
      letterTitle = 'SURAT KETERANGAN SUDAH MENIKAH';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari menerangkan bahwa nama tersebut di atas benar telah melangsungkan pernikahan sah secara hukum/agama dengan pasangan:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Pasangan Suami / Istri</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaPasanganSuamiIstri || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Tanggal / Tahun Nikah</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tglTahunNikah || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Tempat Pelaksanaan Nikah</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tempatNikah || 'Desa Tanjungsari'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Sudah Menikah ini diterbitkan untuk dipergunakan sebagai <strong>${r.keperluan || 'Persyaratan Administrasi'}</strong>.
        </p>
      `;
      break;

    case 'STATUS_JANDA':
      letterTitle = 'SURAT KETERANGAN STATUS JANDA / DUDA';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari menerangkan dengan sebenarnya bahwa orang tersebut di atas saat ini berstatus <strong>${r.spesifik?.statusPernikahanDetil || 'Janda / Duda'}</strong>:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Mantan Suami / Istri</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaMantanPasangan || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Nomor Akta Cerai / Kematian</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.nomorDokumenCeraiMati || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Status Janda/Duda ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'UPCPK':
      letterTitle = 'SURAT REKOMENDASI UPCPK / JAMINAN KESEHATAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar warga penduduk Desa Tanjungsari, ${v.kecamatan}, ${v.kabupaten} yang tergolong dalam <strong>Keluarga Kurang Mampu / Ekonomi Lemah</strong>.
          Surat Rekomendasi ini diterbitkan untuk pengajuan layanan Jaminan Pelayanan Kesehatan melalui UPCPK (Unit Pelayanan Terpadu Penanggulangan Kemiskinan).
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Pasien / Yang Sakit</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaPasien || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Hubungan dengan Pemohon</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.hubunganPasien || 'Diri Sendiri'}</td>
          </tr>
          <tr>
            <td class="label-col">Fasilitas Kesehatan / RS Tujuan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaRumahSakit || 'RSUD SMC Tasikmalaya'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Diagnosa / Keperluan Medis</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.diagnosaPenyakit || r.keperluan || 'Pengobatan Rawat Inap & Tindakan Medis'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Rekomendasi UPCPK ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
        </p>
      `;
      break;

    case 'KEMATIAN':
      letterTitle = 'SURAT KETERANGAN KEMATIAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari Kecamatan Tanjungsari Kabupaten Sumedang menerangkan bahwa:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Lengkap Almarhum/ah</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaAlmarhum || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">NIK Almarhum/ah</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.nikAlmarhum || r.nik}</td>
          </tr>
          <tr>
            <td class="label-col">Tanggal Meninggal</td>
            <td class="colon-col">:</td>
            <td><strong>${formatDateIndonesian(r.spesifik?.tglMeninggal)}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Tempat Meninggal</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.tempatMeninggal || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Sebab Meninggal</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.sebabMeninggal || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Kematian ini dibuat dengan sebenarnya untuk dipergunakan seperlunya oleh pihak keluarga/ahli waris.
        </p>
      `;
      break;

    case 'NIKAH':
      letterTitle = 'SURAT PENGANTAR NIKAH (MODEL N1)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Yang bertanda tangan di bawah ini Kepala Desa Tanjungsari menerangkan bahwa orang tersebut di atas adalah benar warga Desa Tanjungsari dan bermaksud akan melangsungkan pernikahan dengan calon pasangan:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Calon Pasangan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaPasangan || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Bin / Binti Pasangan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.binBintiPasangan || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Alamat Calon Pasangan</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.alamatPasangan || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat pengantar ini diberikan untuk keperluan pendaftaran nikah pada Kantor Urusan Agama (KUA).
        </p>
      `;
      break;

    case 'DOMISILI':
      letterTitle = 'SURAT KETERANGAN DOMISILI';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama yang tercantum di atas adalah benar-benar berdomisili dan bertempat tinggal di alamat tersebut sejak <strong>${r.spesifik?.sejakTanggal || 'lama'}</strong> dengan status tempat tinggal <strong>${r.spesifik?.statusTempatTinggal || 'Milik Sendiri'}</strong>.
        </p>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Domisili ini dibuat untuk dipergunakan sebagai <strong>${r.keperluan || 'Persyaratan Administrasi'}</strong>.
        </p>
      `;
      break;

    case 'BEDA_NAMA':
      letterTitle = 'SURAT KETERANGAN BEDA NAMA';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Menerangkan bahwa terdapat perbedaan penulisan nama warga pada dokumen resmi sebagai berikut:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Tertera di KTP/KK</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaDiDoc1 || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Nama Tertera di Doc Lain</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaDiDoc2 || '-'}</strong></td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Menyatakan dengan sebenarnya bahwa kedua nama yang tertera pada dokumen tersebut adalah <strong>ORANG YANG SAMA</strong>.
        </p>
      `;
      break;

    case 'SKCK':
      letterTitle = 'SURAT PENGANTAR SKCK (CATATAN KEPOLISIAN)';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar-benar penduduk berdomisili di Desa Tanjungsari, Kecamatan Tanjungsari, Kabupaten Sumedang. 
          Berdasarkan catatan kami, yang bersangkutan memiliki berkelakuan baik, tidak sedang tersangkut perkara pidana/perdata, dan surat pengantar ini diberikan untuk keperluan:
        </p>
        <div style="margin: 10px 0 15px 20px; font-weight: 600; color: #14532D; font-size: 15px;">
          "${r.spesifik?.keperluanSkck || r.keperluan || 'Persyaratan Pengurusan SKCK di Polsek Tanjungsari / Polres Sumedang'}"
        </div>
        <p class="letter-opening-text">
          Demikian Surat Pengantar ini dibuat agar pihak Kepolisian dapat menerbitkan Surat Keterangan Catatan Kepolisian (SKCK) sebagaimana mestinya.
        </p>
      `;
      break;

    case 'PENGHASILAN':
      letterTitle = 'SURAT KETERANGAN PENGHASILAN ORANG TUA';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari menerangkan bahwa orang tua / wali dari warga tersebut di atas memiliki estimasi penghasilan rata-rata sebagai berikut:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Penghasilan Rata-rata / Bulan</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.nominalPenghasilan || 'Rp 1.800.000,- (Satu Juta Delapan Ratus Ribu Rupiah)'}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Jumlah Tanggungan Keluarga</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.jumlahTanggungan || '3 (Tiga) Orang'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat keterangan ini diberikan untuk keperluan <strong>${r.spesifik?.tujuanPenghasilan || r.keperluan || 'Persyaratan Beasiswa / Registrasi Perguruan Tinggi'}</strong>.
        </p>
      `;
      break;

    case 'KELAHIRAN':
      letterTitle = 'SURAT KETERANGAN KELAHIRAN';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Kepala Desa Tanjungsari menerangkan bahwa telah lahir seorang anak:
        </p>
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama Anak / Bayi</td>
            <td class="colon-col">:</td>
            <td><strong>${r.spesifik?.namaBayi || r.nama}</strong></td>
          </tr>
          <tr>
            <td class="label-col">Tanggal & Jam Lahir</td>
            <td class="colon-col">:</td>
            <td>${formatDateIndonesian(r.spesifik?.tglLahirBayi || r.tglLahir)} Pukul ${r.spesifik?.jamLahir || '08.00 WIB'}</td>
          </tr>
          <tr>
            <td class="label-col">Nama Ayah Kandung</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.namaAyah || '-'}</td>
          </tr>
          <tr>
            <td class="label-col">Nama Ibu Kandung</td>
            <td class="colon-col">:</td>
            <td>${r.spesifik?.namaIbu || '-'}</td>
          </tr>
        </table>
        <p class="letter-opening-text">
          Surat Keterangan Kelahiran ini diterbitkan sebagai dasar pengurusan Akta Kelahiran dan Kartu Keluarga (KK).
        </p>
      `;
      break;

    case 'AHLI_WARIS':
      letterTitle = 'SURAT KETERANGAN AHLI WARIS';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Menerangkan bahwa almarhum/ah <strong>${r.spesifik?.namaPewaris || 'Pewaris'}</strong> telah meninggal dunia dan meninggalkan ahli waris sah sebagai berikut:
        </p>
        <div style="background: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 10px 0; font-family: monospace; white-space: pre-line;">
${r.spesifik?.daftarWaris || '1. Ahli Waris 1\n2. Ahli Waris 2'}
        </div>
        <p class="letter-opening-text">
          Demikian Surat Keterangan Ahli Waris ini dibuat dengan sebenarnya untuk dipergunakan sebagai <strong>${r.keperluan || 'Persyaratan Administrasi Waris'}</strong>.
        </p>
      `;
      break;

    case 'BELUM_NIKAH':
      letterTitle = 'SURAT KETERANGAN BELUM MENIKAH';
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar warga berdomisili di Desa Tanjungsari dan sampai saat surat keterangan ini diterbitkan yang bersangkutan berstatus <strong>BELUM PERNAH MENIKAH / LAJANG</strong>.
        </p>
        <p class="letter-opening-text">
          Surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagai <strong>${r.keperluan || 'Persyaratan Administrasi Melamar Kerja / Beasiswa'}</strong>.
        </p>
      `;
      break;

    default: // Custom or General Template
      letterTitle = `SURAT KETERANGAN ${r.kategori.replace('_', ' ')}`;
      specificDetailsHTML = `
        <p class="letter-opening-text">
          Bahwa nama tersebut di atas adalah benar warga Desa Tanjungsari, Kecamatan Salawu, Kabupaten Tasikmalaya.
        </p>
        <p class="letter-opening-text">
          Surat keterangan ini dibuat untuk keperluan <strong>${r.keperluan || 'Persyaratan Administrasi'}</strong>.
        </p>
      `;
      break;
  }

  // Official Letter Template Markup
  return `
    <div class="official-document-sheet" id="printable-document">
      <!-- Kop Surat Resmi Desa -->
      <div class="kop-surat">
        <img src="assets/logo.svg" class="kop-logo" alt="Logo Kabupaten Tasikmalaya">
        <div class="kop-text-container">
          <div class="kop-text-gov">PEMERINTAH DAERAH KABUPATEN TASIKMALAYA</div>
          <div class="kop-text-kecamatan">KECAMATAN SALAWU</div>
          <div class="kop-text-desa">KANTOR PEMERINTAH DESA TANJUNGSARI</div>
          <div class="kop-text-alamat">Jln. Raya Tasikmalaya &#8211; Garut Km 34 Kode Pos 46471</div>
          <div class="kop-text-kota">TASIKMALAYA</div>
        </div>
      </div>
      
      <!-- Double Line Divider -->
      <div class="kop-divider"></div>

      <!-- Letter Title & Number -->
      <div class="letter-head-title">
        <div class="letter-title-main">${letterTitle}</div>
        <div class="letter-number-sub">Nomor: ${r.noSurat}</div>
      </div>

      <!-- Main Body Text -->
      <div class="letter-body">
        <p class="letter-opening-text">
          Yang bertanda tangan di bawah ini, Kepala Desa Tanjungsari Kecamatan Salawu Kabupaten Tasikmalaya menerangkan bahwa :
        </p>

        <!-- Citizen Data Table -->
        <table class="letter-data-table">
          <tr>
            <td class="label-col">Nama</td>
            <td class="colon-col">:</td>
            <td><strong>${r.nama.toUpperCase()}</strong></td>
          </tr>
          <tr>
            <td class="label-col">NIK</td>
            <td class="colon-col">:</td>
            <td>${r.nik}</td>
          </tr>
          <tr>
            <td class="label-col">Tempat tanggal lahir</td>
            <td class="colon-col">:</td>
            <td>${r.tmpLahir}, ${tglLahirFormatted.toUpperCase()}</td>
          </tr>
          <tr>
            <td class="label-col">Jenis Kelamin</td>
            <td class="colon-col">:</td>
            <td>${r.jk}</td>
          </tr>
          <tr>
            <td class="label-col">Agama</td>
            <td class="colon-col">:</td>
            <td>${r.agama}</td>
          </tr>
          <tr>
            <td class="label-col">Pekerjaan</td>
            <td class="colon-col">:</td>
            <td>${r.pekerjaan}</td>
          </tr>
          <tr>
            <td class="label-col">Alamat</td>
            <td class="colon-col">:</td>
            <td>${r.alamat}, Desa Tanjungsari,<br>&nbsp;&nbsp;&nbsp;&nbsp;${v.kecamatan} ${v.kabupaten}.</td>
          </tr>
        </table>

        <!-- Specific Type Content -->
        ${specificDetailsHTML}

        <p class="letter-closing-text">
          Demikian Surat Keterangan ini diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <!-- Signature & Stamp Section -->
      <div class="letter-signature-row">
        <div class="signature-box">
          <div class="signature-date">Tanjungsari, ${tglTerbitFormatted}</div>
          <div class="signature-title">${v.jabatanPenandatangan || 'Kepala Desa Tanjungsari'}</div>
          
          <div class="stamp-signature-area">
            <!-- Digital Official Stamp SVG -->
            <svg class="official-stamp" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#1E3A8A" stroke-width="2.5" stroke-dasharray="4 2"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#1E3A8A" stroke-width="1.5"/>
              <text x="50" y="32" font-size="5.5" font-weight="bold" fill="#1E3A8A" text-anchor="middle" font-family="sans-serif">PEMERINTAH KAB. TASIKMALAYA</text>
              <text x="50" y="42" font-size="7.5" font-weight="bold" fill="#1E3A8A" text-anchor="middle" font-family="sans-serif">DESA TANJUNGSARI</text>
              <polygon points="50,47 54,58 43,51 57,51 46,58" fill="#1E3A8A"/>
              <text x="50" y="70" font-size="7" font-weight="bold" fill="#1E3A8A" text-anchor="middle" font-family="sans-serif">KEPALA DESA</text>
            </svg>
            <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 22px; color: #1E3A8A; font-weight: bold; transform: rotate(-4deg); margin-left: 28px;">
              ${(v.namaKades || '').split(' ').slice(-1)[0] || 'Cholik'}
            </div>
          </div>

          <div class="signature-name">${v.namaKades}</div>
          ${v.nipKades && v.nipKades !== '-' ? `<div class="signature-nip">NIP. ${v.nipKades}</div>` : ''}
        </div>
      </div>

      <!-- QR Code Verification Section -->
      <div class="qr-verification-section">
        <!-- SVG Generated QR code mock -->
        <svg class="qr-code-img" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#FFFFFF"/>
          <path d="M10 10h30v30h-30z M15 15h20v20h-20z M22 22h6v6h-6z M60 10h30v30h-30z M65 15h20v20h-20z M72 22h6v6h-6z M10 60h30v30h-30z M15 65h20v20h-20z M22 72h6v6h-6z M50 50h10v10h-10z M70 50h20v10h-20z M50 70h15v20h-15z M75 75h15v15h-15z" fill="#000000"/>
        </svg>
        <div>
          <strong>Sistem Pengarsipan Resmi Desa Tanjungsari</strong><br>
          Dokumen ini sah dan diterbitkan secara digital. Kode Verifikasi: <code>${r.id}</code>
        </div>
      </div>
    </div>
  `;
}

function renderTemplateDraftPreview(templateKey, settings) {
  const templates = window.dataStore.getTemplates();
  const tConfig = templates[templateKey] || LETTER_TYPES.SKU || { title: 'SURAT KETERANGAN', code: '470', syarat: [] };

  const mockRecord = {
    id: `DRAF-${tConfig.code}-SAMPLE`,
    noSurat: `${tConfig.code}/XXX/DS-TS/VIII/${new Date().getFullYear()}`,
    nik: '321104xxxxxxxxxx',
    nama: '[ NAMA PEMOHON ]',
    tmpLahir: 'Sumedang',
    tglLahir: '1990-01-01',
    jk: 'Laki-laki / Perempuan',
    agama: 'Islam',
    pekerjaan: '[ PEKERJAAN PEMOHON ]',
    alamat: '[ ALAMAT DOMISILI PEMOHON, DESA TANJUNGSARI ]',
    kategori: templateKey,
    keperluan: '[ ALASAN / KEPERLUAN PENERBITAN SURAT ]',
    spesifik: {},
    tglTerbit: new Date().toISOString().split('T')[0],
    petugas: 'Admin Desa'
  };

  const letterHTML = generateLetterHTML(mockRecord, settings);
  const syaratList = tConfig.syarat || [
    'Fotokopi KTP Pemohon',
    'Fotokopi Kartu Keluarga (KK)',
    'Surat Pengantar RT/RW Setempat'
  ];

  return `
    <div style="margin-bottom: 20px;">
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 14px 18px; border-radius: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">Informasi Persyaratan Warga</div>
          <div style="font-weight: 600; color: #14532D; font-size: 14px; margin-top: 2px;">
            <i class="fa-solid fa-list-check" style="margin-right: 6px;"></i> Berkas Persyaratan Pembuatan ${tConfig.shortTitle || tConfig.title}
          </div>
        </div>
        <span class="badge-category ${tConfig.badgeClass || 'cat-sku'}" style="font-size: 12px; padding: 4px 10px;">Kode: ${tConfig.code}</span>
      </div>

      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
          ${syaratList.map(s => `
            <li style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
              <i class="fa-solid fa-circle-check" style="color: #16A34A; font-size: 14px;"></i>
              <span>${s}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="font-size: 13px; font-weight: 700; color: #14532D; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
        Pratinjau Draf Naskah Dinas Resmi (Tanjungsari Digital)
      </div>
      
      <div style="position: relative;">
        <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 42px; font-weight: 900; color: rgba(20, 83, 45, 0.08); text-transform: uppercase; pointer-events: none; white-space: nowrap; user-select: none; z-index: 10;">
          DRAF TEMPLATE RESMI
        </div>
        ${letterHTML}
      </div>
    </div>
  `;
}

window.generateLetterHTML = generateLetterHTML;
window.renderTemplateDraftPreview = renderTemplateDraftPreview;
