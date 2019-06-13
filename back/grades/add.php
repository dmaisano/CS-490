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
$responses = $jsonData['responses'];
$instructor_comments = $jsonData['instructor_comments'];
$credit = $jsonData['credit'];

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO grades (student_id, exam, responses, instructor_comments, credit, finalized) VALUES (?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);

    $args = array(
        $student_id,
        json_encode($exam),
        json_encode($responses),
        json_encode($jsonData['instructor_comments']),
        json_encode($jsonData['credit']),
        0
    );

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully created exam');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

$response['credit'] = $jsonData['credit'];

echo json_encode($response);
