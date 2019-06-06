<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$exam_name = $jsonData['exam_name'];
$question_ids = $jsonData['question_ids'];
$points = $jsonData['points'];

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO exams (exam_name, question_ids, points) VALUES (?,?,?)";
    $stmt = $pdo->prepare($sql);

    $args = array($exam_name, json_encode($question_ids), json_encode($points));

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully created exam');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
