<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$user = $jsonData['user'];
$pass = $jsonData['pass'];
$type = $jsonData['type'];

// exit if no user / pass
if (!isset($user) || !isset($pass)) {
    exit404('missing field');
}

$hashedPass = password_hash($pass, PASSWORD_DEFAULT);

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO demo_users VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    $args = array($user, $hashedPass, $type);
    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully added user "' . $user . '"');
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
