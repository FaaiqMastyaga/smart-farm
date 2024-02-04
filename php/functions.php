<?php
    include("./config.php");
    
    function addPlant($plantName, $harvestDay, $schedule) {
        global $db;

        $insertPlantQuery = "INSERT INTO tanaman (nama_tanaman, masa_panen) VALUES ('$plantName', '$harvestDay')";

        if ($db->query($insertPlantQuery) === TRUE) {
            $lastPlantId = $db->insert_id;
            foreach ($schedule as $row) {
                $insertScheduleQuery = 
                "INSERT INTO jadwal (tanaman_id, pekan, dosis, pupuk_a, pupuk_b, pupuk_c) VALUES ('$lastPlantId', '$row[0]', '$row[1]', '$row[2]', '$row[3]', '$row[4]')";

                $db->query($insertScheduleQuery);
            }

            echo "Success";
        } else {
            echo "Failed";
        }

        $db->close();
    }

    function getPlant($plantId) {
        global $db;

        $sql = $db->query("SELECT * FROM tanaman WHERE tanaman_id = $plantId");
        $plant = $sql->fetch_assoc();

        echo json_encode($plant);
        $db->close();
    }
    function getPlants() {
        global $db;

        $sql = $db->query("SELECT * FROM tanaman ORDER BY tanaman_id ASC");
        $plants = array();

        while($row = $sql->fetch_assoc()) {
            $plants[] = $row;
        }
        echo json_encode($plants);
        $db->close();
    }
    
    function getPlantProgress($plantId) {
        global $db;

        $sql = $db->query("SELECT * FROM progress WHERE tanaman_id = $plantId ORDER BY pekan");
        $plantProgress = array();
        
        while($row = $sql->fetch_assoc()) {
            $plantProgress[] = $row;
        }
        echo json_encode($plantProgress);
        $db->close();
    }

    function getSchedule($plantId) {
        global $db;

        $sql = $db->query("SELECT * FROM jadwal WHERE tanaman_id = $plantId ORDER BY pekan");
        $schedule = array();

        while($row = $sql->fetch_assoc()) {
            $schedule[] = $row;
        }
        echo json_encode($schedule);
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

    function startProgress($plantId, $currentTime) {
        global $db;

        $sql = $db->query("UPDATE tanaman SET waktu_mulai = '$currentTime' WHERE tanaman_id = $plantId");

        if ($sql) {
            echo "Successfully start progress plant.";
        } else {
            echo "Error". $db->error;
        }
        $db->close();
    }

    function incrementDay($plantId, $day) {
        global $db;

        $sql = $db->query("UPDATE tanaman SET hari = '$day' WHERE tanaman_id = $plantId");

        if ($sql) {
            echo "Successfully update progress day.";
        } else {
            echo "Error". $db->error;
        }
        $db->close();
    }
?>