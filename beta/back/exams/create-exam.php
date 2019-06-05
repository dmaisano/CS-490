<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$l_name = $jsonData['exam_name'];
$q_ids = $jsonData['question_ids'];
$points = $jsonData['points'];

// exit if any fields are empty
if (!isset($l_name) || !isset($q_ids) || !isset($points)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO examss (exam_name) VALUES (?)";
    $stmt = $pdo->prepare($sql);

    $args = array($name);
    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully created exam "' . $name . '"');

    for ($i = 0; $i < $length; $i++) {
        $sql = "INSERT INTO examss (exam_name) VALUES (?)";
        $stmt = $pdo->prepare($sql);

        $args = array($name);
        $status = $stmt->execute($args);

        $response = array('success' => true, 'msg' => 'successfully created exam "' . $name . '"');
    }
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
