<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new Database();
$pdo = $db->connect();

try {
    $result = array();

    $stmt = $pdo->query("SELECT * FROM questions");

    while ($row = $stmt->fetch()) {
        array_push($result, $row);
    }

    for ($i = 0; $i < count($result); $i++) {
        $result[$i]['constraints'] = json_decode($result[$i]['constraints'], true);
        $result[$i]['test_cases'] = json_decode($result[$i]['test_cases'], true);
    }

    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
