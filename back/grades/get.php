<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new Database();
$pdo = $db->connect();

try {
    $result = array();

    $stmt = $pdo->query("SELECT * FROM grades");

    while ($row = $stmt->fetch()) {
        array_push($result, $row);
    }

    for ($i = 0; $i < count($result); $i++) {
        // $result[$i] = json_decode($result[$i], true);
        $result[$i]['exam'] = json_decode($result[$i]['exam']);
        $result[$i]['responses'] = json_decode($result[$i]['responses']);
        $result[$i]['instructor_comments'] = json_decode($result[$i]['instructor_comments']);
        $result[$i]['points_earned'] = json_decode($result[$i]['points_earned']);
    }

    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
