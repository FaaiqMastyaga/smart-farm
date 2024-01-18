<link rel="stylesheet" href="../css/monitor/monitor.css" />
<?php
// Koneksi ke database
include('koneksi_databases.php');

// Query untuk mengambil data dari database
$query = "SELECT tanaman.nama_tanaman, tanaman.masa_panen, pemberianpupuk.nama_pupuk, pemberianpupuk.jumlah_pupuk, pemberianpupuk.waktu_pemberian FROM tanaman JOIN pemberianpupuk ON tanaman.tanaman_id = pemberianpupuk.tanaman_id";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    echo '<h2>View Table</h2>';
    echo '<table id="data-table">';
    echo '<thead>';
    echo '<tr>';
    echo '<th>Nama Tanaman</th>';
    echo '<th>Masa Panen</th>';
    echo '<th>Nama Pupuk</th>';
    echo '<th>Jumlah Pupuk</th>';
    echo '<th>Jadwal Pemberian</th>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';

    while ($row = $result->fetch_assoc()) {
        echo '<tr>';
        echo '<td>' . $row['nama_tanaman'] . '</td>';
        echo '<td>' . $row['masa_panen'] . '</td>';
        echo '<td>' . $row['nama_pupuk'] . '</td>';
        echo '<td>' . $row['jumlah_pupuk'] . '</td>';
        echo '<td>' . $row['waktu_pemberian'] . '</td>';
        echo '</tr>';
    }

    echo '</tbody>';
    echo '</table>';
} else {
    echo '<p>Tidak ada data yang ditemukan.</p>';
}

// Tutup koneksi
$conn->close();
?>
