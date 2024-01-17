<?php
    include("./config.php");
    
    function getPlants() {
        global $db;

        $sql = $db->query("SELECT * FROM tanaman");
        $plants = array();

        while( $row = $sql->fetch_assoc() ) {
            $plants[] = $row;
        }
        echo json_encode($plants);
        $db->close();
    }

    function deletePlant($plantName) {
        global $db;

        $plantName = $db->real_escape_string($plantName);
        $sql = $db->query("DELETE FROM tanaman WHERE nama_tanaman = '$plantName'");

        if ($sql) {
            getPlants();
        } else {
            echo "Error". $db->error;
        }
        $db->close();
    }
?>