<?php
    include_once("./database.php");

    header("Content-Type: application/json");

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        if (isset($_GET["action"])) {
            $action = $_GET["action"];

            if ($action == "get_plants") {
                getPlants();
            }
        }
    }
?>