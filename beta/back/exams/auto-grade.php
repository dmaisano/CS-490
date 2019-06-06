<?php

include './database.php';
include './utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$exam_id = $jsonData['exam_id'];
$student_id = $jsonData['student_id'];
$responses = $jsonData['responses'];
$points_earned = $jsonData['points_earned'];
$finalized = 0;

// exit if any fields are empty
if (!isset($exam_id) || !isset($student_id)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO grades (exam_id,student_id,responses, points_earned,finalized) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $test_cases = json_encode($test_cases);

    $args = array($exam_id, $student_id, json_encode($responses), json_encode($instructor_comments), json_encode($points_earned), $finalized);
    $status = $stmt->execute($args);
    $response = array('success' => true, 'msg' => 'successfully added grade for "' . $student_id . '"');
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
