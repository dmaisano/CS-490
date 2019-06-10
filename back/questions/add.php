<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$question_name = $jsonData['question_name'];
$function_name = $jsonData['function_name'];
$question_description = $jsonData['question_description'];
$difficulty = $jsonData['difficulty'];
$topic = $jsonData['topic'];
$constraints = $jsonData['constraints'];
$test_cases = $jsonData['test_cases'];

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO questions (question_name, function_name, question_description, difficulty, topic, constraints, test_cases) VALUES (?,?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);

    $args = array($question_name, $function_name, $question_description, $difficulty, $topic, json_encode($constraints), json_encode($test_cases));

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully created question');
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
