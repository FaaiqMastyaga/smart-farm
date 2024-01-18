<?php
include('koneksi_databases.php');
if (isset($_FILES['excelFile']) && $_FILES['excelFile']['error'] === UPLOAD_ERR_OK) {
    // Baca file Excel
    $excelFile = $_FILES['excelFile']['tmp_name'];

    // Gunakan pustaka Excel Reader (contoh menggunakan PhpSpreadsheet)
    require 'vendor/autoload.php';

    $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('Xlsx');
    $spreadsheet = $reader->load($excelFile);

    // Ambil data dari lembar kerja pertama (worksheet)
    $worksheet = $spreadsheet->getActiveSheet();
    $highestRow = $worksheet->getHighestRow();

    // Proses data dan masukkan ke dalam database
    for ($row = 2; $row <= $highestRow; $row++) {
        $nama_tanaman = $worksheet->getCellByColumnAndRow(1, $row)->getValue();
        $masa_panen = $worksheet->getCellByColumnAndRow(2, $row)->getValue();
        // (tambahkan kolom lain sesuai dengan kebutuhan)

        // Masukkan data ke dalam database (gunakan prepared statement untuk menghindari SQL injection)
        $stmt = $conn->prepare("INSERT INTO nama_tabel (nama_tanaman, masa_panen) VALUES (?, ?)");
        $stmt->bind_param("ss", $nama_tanaman, $masa_panen);
        $stmt->execute();
        $stmt->close();
    }

    echo "Data from Excel successfully uploaded to the database.";

} else {
    echo "Failed to upload Excel file.";
}
?>