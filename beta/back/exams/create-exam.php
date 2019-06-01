<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$name = $jsonData['exam_name'];

// exit if any fields are empty
if (!isset($name)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO exam_list(exam_name) VALUES (?)";
    $stmt = $pdo->prepare($sql);

    $args = array($name);
    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully created exam "' . $name . '"');
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
