<?php
    include("./config.php");
    
    function getPlants() {
        global $db;

        $sql = $db->query("SELECT * FROM tanaman");
        $plants = array();

        while($row = $sql->fetch_assoc()) {
            $plants[] = $row;
        }
        echo json_encode($plants);
        $db->close();
    }
    
        function getPlantProgress($plantId) {
            global $db;
    
            $sql = $db->query("SELECT * FROM progress WHERE tanaman_id = $plantId");
            $plantProgress = array();
            
            while($row = $sql->fetch_assoc()) {
                $plantProgress[] = $row;
            }
            echo json_encode($plantProgress);
            $db->close();
        }

    function deletePlant($plantId) {
        global $db;

        $sql = $db->query("DELETE FROM tanaman WHERE tanaman_id = $plantId");

        if ($sql) {
            echo "Successfully delete plant.";
        } else {
            echo "Error". $db->error;
        }
        $db->close();
    }
?>