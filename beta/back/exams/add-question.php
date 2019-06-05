<?php

include './database.php';
include './utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$q_name = $jsonData['question_name'];
$f_name = $jsonData['function_name'];
$q_desc = $jsonData['question_description'];
$topic = $jsonData['topic'];
$difficulty = $jsonData['difficulty'];
$test_cases = $jsonData['test_cases'];

// exit if any fields are empty
if (!isset($q_name) || !isset($f_name) || !isset($q_desc) || !isset($difficulty) || !isset($topic) || !isset($test_cases)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO questions (question_name,function_name,question_description,difficulty,topic,test_cases) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $test_cases = json_encode($test_cases);

    $args = array($q_name, $f_name, $q_desc, $difficulty, $topic, $test_cases);
    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully added question "' . $q_name . '"');
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
