<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$exam = $jsonData['exam'];
$student_id = $jsonData['student_id'];
$responses = $jsonData['responses'];
$instructor_comments = $jsonData['instructor_comments'];
$points = $jsonData['points'];
$points_earned = $jsonData['points_earned'];

$finalized = 0;

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO grades (exam, student_id, responses, instructor_comments, points_earned, finalized) VALUES (?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);

    $args = array(
        json_encode($exam),
        $student_id,
        json_encode($responses),
        json_encode($instructor_comments),
        json_encode($points_earned),
        $finalized,
    );

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully added grade');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
