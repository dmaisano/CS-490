<?php

include '../beta/back/config/database.php';
include '../beta/back/utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$authors = $jsonData['authors'];

// exit if any fields are empty
if (!isset($authors)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO books (authors) VALUES (?)";
    $stmt = $pdo->prepare($sql);

    $args = array(json_encode($authors));

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully created book');
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
