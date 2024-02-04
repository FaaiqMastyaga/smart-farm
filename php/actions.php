<?php
    include_once("./config.php");
    include_once("./functions.php");

    header("Content-Type: application/json");

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        if (isset($_GET["action"])) {
            $action = $_GET["action"];

            if ($action == "get_plants") {
                getPlants();
            }
        }
    }
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = file_get_contents("php://input");

        if ($data) {
            $data = json_decode($data, true);

            if (($data !== null) && (isset($data["action"]))) {
                $action = $data["action"];
                if ($action == "add_plant") {
                    $plantName = $data["plantName"];
                    $harvestDay = $data["harvestDay"];
                    $schedule = $data["schedule"];
                    addPlant($plantName, $harvestDay, $schedule);
                }
                else if ($action == "delete_plant") {
                    $plantId = $data["plantId"];
                    deletePlant($plantId);
                }
                else if ($action == "get_plant") {
                    $plantId = $data["plantId"];
                    getPlant($plantId);
                }
                else if ($action == "get_plant_progress") {
                    $plantId = $data["plantId"];
                    getPlantProgress($plantId);
                }
                else if ($action == "get_schedule") {
                    $plantId = $data["plantId"];
                    getSchedule($plantId);
                }
                else if ($action == "start_progress") {
                    $plantId = $data["plantId"];
                    $currentTime = $data["currentTime"];
                    startProgress($plantId, $currentTime);
                }
                else if ($action == "increment_day") {
                    $plantId = $data["plantId"];
                    $day = $data["day"];
                    incrementDay($plantId, $day);
                }
            }
        }
    }
?>