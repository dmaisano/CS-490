<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$name = $jsonData['name'];
$text = $jsonData['text'];
$text = $jsonData['topic'];
$text = $jsonData['difficulty'];
$text = $jsonData['constraints'];

// exit if any fields are empty
if (!isset($name) || !isset($text) || !isset($topic) || !isset($difficulty) || !isset($constraints)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO questions (name,text,topic,difficulty,constraints) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    $args = array($name, $text, $topic, $difficulty, $constraints);
    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully added question "' . $name . '"');
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
