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
$exam = $jsonData['exam'];

if ($user['type'] != 'instructor') {
    exit404('not auth');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "UPDATE grades SET finalized = 1  WHERE id = ? AND student_id = ?";
    $stmt = $pdo->prepare($sql);

    $args = array(
        $exam['id'],
        $student_id
    );

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully published grade');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
