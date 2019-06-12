<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$user = $jsonData['user'];

$db = new Database();
$pdo = $db->connect();

try {
    $result = array();

    $stmt = $pdo->query("SELECT * FROM grades WHERE student_id = ?");

    $args = array($user);

    $status = $stmt->execute($args);

    while ($row = $stmt->fetch()) {
        array_push($result, $row);
    }

    for ($i = 0; $i < count($result); $i++) {
        $result[$i]['exam'] = json_decode($result[$i]['exam'], true);
    }

    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
