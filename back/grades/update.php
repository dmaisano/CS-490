<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$student_id = $jsonData['student_id'];
$exam = $jsonData['exam'];
$instructor_comments = $jsonData['instructor_comments'];
$credit = $jsonData['credit'];

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
    $sql = "UPDATE grades SET instructor_comments = ?, credit = ?, finalized = 1  WHERE id = ? AND student_id = ?";
    $stmt = $pdo->prepare($sql);

    $args = array(
        json_encode($instructor_comments),
        json_encode($credit),
        $exam['id'],
        $student_id
    );

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully updated grade');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
