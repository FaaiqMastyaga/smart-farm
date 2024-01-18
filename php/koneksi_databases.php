<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'id21772710_database_01';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi Gagal: " . $conn->connect_error);
}
// Query to fetch data
// $query = "SELECT tanaman.nama_tanaman, pemberian_pupuk.nama_pupuk, pemberian_pupuk.jumlah_pupuk, tanaman.masa_panen, tanaman.jadwal_pemberian FROM tanaman
//           JOIN pemberian_pupuk ON tanaman.id_tanaman = pemberian_pupuk.id_tanaman";
// $result = $conn->query($query);

// $data = array();

// if ($result->num_rows > 0) {
//     while ($row = $result->fetch_assoc()) {
//         $data[] = $row;
//     }
// }


// Close connection
// $conn->close();


// Return data as JSON
// header('Content-Type: application/json');
// echo json_encode($data);
?>