<?php

include '../config/database.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

// exit if no user / pass
if (!isset($jsonData['user']) || !isset($jsonData['pass'])) {
    header('HTTP/1.0 403 Forbidden', true, 403);
    echo 'missing field';
    exit(403);
}

$user = $jsonData['user'];
$pass = $jsonData['pass'];

$db = new Database();
$pdo = $db->connect();

$query = $pdo->prepare("SELECT * FROM users WHERE user = ?");

$queryStatus = $query->execute(array($user));

if ($queryStatus) {
    $result = $query->fetchAll();
} else {
    header('HTTP/1.0 403 Forbidden', true, 403);
    echo 'forbidden';
}
