<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$exam = $jsonData['exam'];
$student_id = $jsonData['student_id'];
$instructor_comments = $jsonData['instructor_comments'];
$points_earned = $jsonData['points_earned'];

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "UPDATE grades SET instructor_comments = ? AND points_earned = ? AND finalized = 1 WHERE student_id = ?";
    $stmt = $pdo->prepare($sql);

    $args = array(
        json_encode($instructor_comments),
        json_encode($points_earned),
        $student_id
    );

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully added grade');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
