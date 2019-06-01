<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$q_name = $jsonData['question_name'];
$l_name = $jsonData['exam_name'];

// exit if any fields are empty
if (!isset($q_name) || !isset($l_name)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {

    $q_sql = "SELECT q_id FROM questions WHERE name=:q_name";
    $q_stmt = $pdo->prepare($q_sql);
    $q_stmt->bindParam(':q_name', $q_name);
    $q_stmt->execute();
    $q_result = $q_stmt->fetch();

    $l_sql = "SELECT list_id FROM exam_list WHERE exam_name=:l_name";
    $l_stmt = $pdo->prepare($l_sql);
    $l_stmt->bindParam(':l_name', $l_name);
    $l_stmt->execute();
    $l_result = $l_stmt->fetch();

    if ($q_result && $l_result) {
        $args = array_merge($q_result, $l_result);
        $sql = "INSERT INTO exam(list_id, q_id) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $status = $stmt->execute($args);
    }
    $response = array('success' => true, 'msg' => 'successfully added question "' . $q_name . '" to exam "' . $l_name);
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
