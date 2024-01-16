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
?>