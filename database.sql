-- phpMyAdmin SQL Dump
-- version 5.2.0
-- Host: localhost
-- Generation Time: Aug 19, 2026 at 02:08 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_pengarsipan_desatanjungsari`
--
CREATE DATABASE IF NOT EXISTS `db_pengarsipan_desatanjungsari` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_pengarsipan_desatanjungsari`;

-- --------------------------------------------------------

--
-- Table structure for table `tb_arsip_surat`
--

CREATE TABLE `tb_arsip_surat` (
  `id` varchar(50) NOT NULL,
  `no_surat` varchar(100) DEFAULT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `nama` varchar(150) DEFAULT NULL,
  `tmp_lahir` varchar(100) DEFAULT NULL,
  `tgl_lahir` varchar(20) DEFAULT NULL,
  `jk` varchar(20) DEFAULT NULL,
  `agama` varchar(50) DEFAULT NULL,
  `pekerjaan` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `keperluan` text DEFAULT NULL,
  `data_spesifik` json DEFAULT NULL,
  `tgl_terbit` varchar(50) DEFAULT NULL,
  `petugas` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tb_jenis_surat`
--

CREATE TABLE `tb_jenis_surat` (
  `kode_jenis` varchar(50) NOT NULL,
  `kode_klasifikasi` varchar(50) DEFAULT NULL,
  `judul_surat` varchar(150) DEFAULT NULL,
  `judul_singkat` varchar(100) DEFAULT NULL,
  `kategori_grup` varchar(100) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `syarat_persyaratan` json DEFAULT NULL,
  `fields_dinamis` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tb_log_aktivitas`
--

CREATE TABLE `tb_log_aktivitas` (
  `id` int(11) NOT NULL,
  `aktivitas` text DEFAULT NULL,
  `waktu` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tb_pengaturan_desa`
--

CREATE TABLE `tb_pengaturan_desa` (
  `id` int(11) NOT NULL,
  `kabupaten` varchar(100) DEFAULT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `desa` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `kode_pos` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `nama_kades` varchar(150) DEFAULT NULL,
  `nip_kades` varchar(50) DEFAULT NULL,
  `jabatan_penandatangan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_pengaturan_desa`
--

INSERT INTO `tb_pengaturan_desa` (`id`, `kabupaten`, `kecamatan`, `desa`, `alamat`, `kode_pos`, `email`, `telepon`, `nama_kades`, `nip_kades`, `jabatan_penandatangan`) VALUES
(1, 'Kabupaten Bogor', 'Tanjungsari', 'Tanjungsari', 'Jl. Raya Tanjungsari No. 123', '16840', 'pemdes.tanjungsari@gmail.com', '08123456789', 'Nama Kades', '19800101 200003 1 001', 'Kepala Desa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_arsip_surat`
--
ALTER TABLE `tb_arsip_surat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_jenis_surat`
--
ALTER TABLE `tb_jenis_surat`
  ADD PRIMARY KEY (`kode_jenis`);

--
-- Indexes for table `tb_log_aktivitas`
--
ALTER TABLE `tb_log_aktivitas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_pengaturan_desa`
--
ALTER TABLE `tb_pengaturan_desa`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_log_aktivitas`
--
ALTER TABLE `tb_log_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_pengaturan_desa`
--
ALTER TABLE `tb_pengaturan_desa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
