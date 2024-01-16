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
?>