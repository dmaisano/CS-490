<?php

include '../config/database.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonData = json_decode(file_get_contents('php://input'), true);

$user = $jsonData['user'];
$pass = $jsonData['pass'];

// exit if no user / pass
if (!isset($user) || !isset($pass)) {
    header('HTTP/1.0 403 Forbidden', true, 403);
    exit(403);
}

$db = new Database();
$pdo = $db->connect();

$query = "SELECT * FROM users WHERE username = '$user' AND pass = '$pass'";
$query = $pdo->query($query);

if ($query->rowCount() > 0) {
    $result = $query->fetch();
    echo json_encode($result);
} else {
    header('HTTP/1.0 403 Forbidden', true, 403);
}
