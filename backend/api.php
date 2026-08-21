<?php
// backend/api.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Jika request OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'get_all':
        // 1. Dapatkan Pengaturan Desa
        $settings = [];
        $result = $conn->query("SELECT * FROM tb_pengaturan_desa LIMIT 1");
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $settings = [
                'kabupaten' => $row['kabupaten'],
                'kecamatan' => $row['kecamatan'],
                'desa' => $row['desa'],
                'alamat' => $row['alamat'],
                'kodePos' => $row['kode_pos'],
                'email' => $row['email'],
                'telepon' => $row['telepon'],
                'namaKades' => $row['nama_kades'],
                'nipKades' => $row['nip_kades'],
                'jabatanPenandatangan' => $row['jabatan_penandatangan']
            ];
        }

        // 2. Dapatkan Records
        $records = [];
        $result = $conn->query("SELECT * FROM tb_arsip_surat ORDER BY tgl_terbit DESC, created_at DESC");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $records[] = [
                    'id' => $row['id'],
                    'noSurat' => $row['no_surat'],
                    'nik' => $row['nik'],
                    'nama' => $row['nama'],
                    'tmpLahir' => $row['tmp_lahir'],
                    'tglLahir' => $row['tgl_lahir'],
                    'jk' => $row['jk'],
                    'agama' => $row['agama'],
                    'pekerjaan' => $row['pekerjaan'],
                    'alamat' => $row['alamat'],
                    'kategori' => $row['kategori'],
                    'keperluan' => $row['keperluan'],
                    'spesifik' => json_decode($row['data_spesifik'], true),
                    'tglTerbit' => $row['tgl_terbit'],
                    'petugas' => $row['petugas']
                ];
            }
        }

        // 3. Dapatkan Templates
        $templates = new stdClass();
        $result = $conn->query("SELECT * FROM tb_jenis_surat");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $templates->{$row['kode_jenis']} = [
                    'id' => $row['kode_jenis'],
                    'code' => $row['kode_klasifikasi'],
                    'title' => $row['judul_surat'],
                    'shortTitle' => $row['judul_singkat'],
                    'categoryGroup' => $row['kategori_grup'],
                    'desc' => $row['deskripsi'],
                    'syarat' => json_decode($row['syarat_persyaratan'], true),
                    'fields' => json_decode($row['fields_dinamis'], true)
                ];
            }
        }

        // 4. Dapatkan Activities
        $activities = [];
        $result = $conn->query("SELECT * FROM tb_log_aktivitas ORDER BY created_at DESC LIMIT 20");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $activities[] = [
                    'text' => $row['aktivitas'],
                    'time' => $row['waktu']
                ];
            }
        }

        echo json_encode([
            'status' => 'success',
            'data' => [
                'settings' => $settings,
                'records' => $records,
                'templates' => $templates,
                'activities' => $activities
            ]
        ]);
        break;

    case 'save_setting':
        if (!$input) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            break;
        }
        $stmt = $conn->prepare("UPDATE tb_pengaturan_desa SET kabupaten=?, kecamatan=?, desa=?, alamat=?, kode_pos=?, email=?, telepon=?, nama_kades=?, nip_kades=?, jabatan_penandatangan=? WHERE id=1");
        $stmt->bind_param("ssssssssss", 
            $input['kabupaten'], $input['kecamatan'], $input['desa'], 
            $input['alamat'], $input['kodePos'], $input['email'], 
            $input['telepon'], $input['namaKades'], $input['nipKades'], 
            $input['jabatanPenandatangan']
        );
        $result = $stmt->execute();
        echo json_encode(['status' => $result ? 'success' : 'error']);
        break;

    case 'save_record':
        if (!$input) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            break;
        }
        
        // Cek apakah sudah ada (Update) atau belum (Insert)
        $id = $conn->real_escape_string($input['id']);
        $check = $conn->query("SELECT id FROM tb_arsip_surat WHERE id='$id'");
        
        $spesifik = json_encode($input['spesifik']);
        
        if ($check && $check->num_rows > 0) {
            // Update (jarang terjadi di sistem arsip, tapi untuk jaga-jaga)
            $stmt = $conn->prepare("UPDATE tb_arsip_surat SET no_surat=?, nik=?, nama=?, tmp_lahir=?, tgl_lahir=?, jk=?, agama=?, pekerjaan=?, alamat=?, kategori=?, keperluan=?, data_spesifik=?, tgl_terbit=?, petugas=? WHERE id=?");
            $stmt->bind_param("sssssssssssssss", 
                $input['noSurat'], $input['nik'], $input['nama'], $input['tmpLahir'], 
                $input['tglLahir'], $input['jk'], $input['agama'], $input['pekerjaan'], 
                $input['alamat'], $input['kategori'], $input['keperluan'], $spesifik, 
                $input['tglTerbit'], $input['petugas'], $input['id']
            );
            $result = $stmt->execute();
        } else {
            // Insert
            $stmt = $conn->prepare("INSERT INTO tb_arsip_surat (id, no_surat, nik, nama, tmp_lahir, tgl_lahir, jk, agama, pekerjaan, alamat, kategori, keperluan, data_spesifik, tgl_terbit, petugas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssssssssssss", 
                $input['id'], $input['noSurat'], $input['nik'], $input['nama'], $input['tmpLahir'], 
                $input['tglLahir'], $input['jk'], $input['agama'], $input['pekerjaan'], 
                $input['alamat'], $input['kategori'], $input['keperluan'], $spesifik, 
                $input['tglTerbit'], $input['petugas']
            );
            $result = $stmt->execute();
        }
        echo json_encode(['status' => $result ? 'success' : 'error']);
        break;

    case 'log_activity':
        if (!$input) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            break;
        }
        $stmt = $conn->prepare("INSERT INTO tb_log_aktivitas (aktivitas, waktu) VALUES (?, ?)");
        $stmt->bind_param("ss", $input['text'], $input['time']);
        $result = $stmt->execute();
        echo json_encode(['status' => $result ? 'success' : 'error']);
        break;

    case 'delete_record':
        if (!$input || !isset($input['id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            break;
        }
        $stmt = $conn->prepare("DELETE FROM tb_arsip_surat WHERE id=?");
        $stmt->bind_param("s", $input['id']);
        $result = $stmt->execute();
        echo json_encode(['status' => $result ? 'success' : 'error']);
        break;

    case 'save_template':
        if (!$input) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            break;
        }
        $id = $conn->real_escape_string($input['id']);
        $check = $conn->query("SELECT kode_jenis FROM tb_jenis_surat WHERE kode_jenis='$id'");
        
        $syarat = json_encode($input['syarat']);
        $fields = json_encode($input['fields']);
        
        if ($check && $check->num_rows > 0) {
            $stmt = $conn->prepare("UPDATE tb_jenis_surat SET kode_klasifikasi=?, judul_surat=?, judul_singkat=?, kategori_grup=?, deskripsi=?, syarat_persyaratan=?, fields_dinamis=? WHERE kode_jenis=?");
            $stmt->bind_param("ssssssss", 
                $input['code'], $input['title'], $input['shortTitle'], 
                $input['categoryGroup'], $input['desc'], $syarat, $fields, $input['id']
            );
            $result = $stmt->execute();
        } else {
            $stmt = $conn->prepare("INSERT INTO tb_jenis_surat (kode_jenis, kode_klasifikasi, judul_surat, judul_singkat, kategori_grup, deskripsi, syarat_persyaratan, fields_dinamis) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssss", 
                $input['id'], $input['code'], $input['title'], $input['shortTitle'], 
                $input['categoryGroup'], $input['desc'], $syarat, $fields
            );
            $result = $stmt->execute();
        }
        echo json_encode(['status' => $result ? 'success' : 'error']);
        break;

    case 'delete_template':
        if (!$input || !isset($input['id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
            break;
        }
        $stmt = $conn->prepare("DELETE FROM tb_jenis_surat WHERE kode_jenis=?");
        $stmt->bind_param("s", $input['id']);
        $result = $stmt->execute();
        echo json_encode(['status' => $result ? 'success' : 'error']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Unknown action']);
        break;
}
?>
