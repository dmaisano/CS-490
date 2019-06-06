<?php

include './config/database.php';
include './utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new Database();
$pdo = $db->connect();

try {
    $result = array();

    $stmt = $pdo->query("SELECT * FROM users WHERE type = 'student'");

    while ($row = $stmt->fetch()) {
        array_push($result, json_encode($row));
    }

    for ($i = 0; $i < count($result); $i++) {
        $result[$i] = json_decode($result[$i], true);
    }

    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
