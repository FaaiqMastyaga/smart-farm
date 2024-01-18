<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Mengambil nilai dari formulir
    $nama_tanaman = $_POST['nama_tanaman'];
    $deskripsi_tanaman = $_POST['deskripsi_tanaman'];
    $waktu_pemberian = $_POST['waktu_pemupukan'];
    $masa_panen = $_POST['masa_panen'];
    $nama_pupuk = $_POST['nama_pupuk']; // Menambahkan baris ini
    $jumlah_pupuk = $_POST['jumlah_pupuk'];

    include('koneksi_databases.php');

    try {
        // Mulai transaksi
        $conn->begin_transaction();

        // Query pertama
        $sql_tanaman = "INSERT INTO tanaman (nama_tanaman, deskripsi_tanaman, masa_panen) VALUES ('$nama_tanaman', '$deskripsi_tanaman', '$masa_panen')";
        $conn->query($sql_tanaman);

        // Query kedua
        $tanaman_id = $conn->insert_id;  // Ambil id terakhir yang di-generate
        $sql_pemberianpupuk = "INSERT INTO pemberianpupuk (tanaman_id, waktu_pemberian, nama_pupuk, jumlah_pupuk) VALUES ('$tanaman_id', '$waktu_pemberian', '$nama_pupuk', '$jumlah_pupuk')";
        $conn->query($sql_pemberianpupuk);

        // Commit transaksi jika semua query berhasil
        $conn->commit();

        // Redirect ke view.php setelah penyimpanan berhasil
        header("Location: ../pages/monitor.html");
        exit();
    } catch (Exception $e) {
        // Rollback transaksi jika terjadi kesalahan
        $conn->rollback();
        echo "Error: " . $e->getMessage();
    }

    // Tutup koneksi
    $conn->close();
}
?>
