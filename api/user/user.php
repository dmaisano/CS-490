<?php

include '../config/config.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonData = json_decode(file_get_contents('php://input'), true);

$user = $jsonData['user'];
$pass = $jsonData['pass'];

// exit if no user / pass
if (!isset($user) || !isset($pass)) {
    header('HTTP/1.0 403 Forbidden', true, 403);
    exit(403);
}

$mysqli = new mysqli($config[0], $config[1], $config[2], $config[3]);

$result = $mysqli->query("SELECT * FROM users WHERE username = '$user' AND pass = '$pass'");
$count = $result->num_rows;

// check if result is empty
if (!empty($count)) {
    echo json_encode($result->fetch_assoc());
} else {
    header('HTTP/1.0 403 Forbidden', true, 403);
    echo '{}'; // return empty object
}

$mysqli->close();
