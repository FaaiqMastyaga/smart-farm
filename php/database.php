<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "db_smartfarm";

    $conn = new mysqli($servername, $username, $password, $dbname);

    function getPlants() {
        global $conn;

        if ($conn->connect_error) {
            die("Connection  failed: ". $conn->connect_error);
        }

        $sql = $conn->query("SELECT* FROM tanaman");
        $plants = array();

        while( $row = $sql->fetch_assoc() ) {
            $plants[] = $row;
        }
        echo json_encode($plants);
        $conn->close();
    }
?>