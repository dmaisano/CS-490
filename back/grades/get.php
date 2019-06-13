<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

if (!isset($jsonData['user'])) {
    exit404('missing user');
}

$user = $jsonData['user'];

$db = new Database();
$pdo = $db->connect();

try {
    $result = array();

    $stmt = $pdo->query("SELECT * FROM grades WHERE student_id = '" . $user['id'] . "'");

    while ($row = $stmt->fetch()) {
        array_push($result, $row);
    }

    for ($i = 0; $i < count($result); $i++) {
        $result[$i]['exam'] = json_decode($result[$i]['exam']);
        $result[$i]['responses'] = json_decode($result[$i]['responses']);
        $result[$i]['instructor_comments'] = json_decode($result[$i]['instructor_comments']);
        $result[$i]['credit'] = json_decode($result[$i]['credit']);

    }

    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
