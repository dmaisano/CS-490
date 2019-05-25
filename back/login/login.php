<?php

include '../config/database.php';
include '../utils/error.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

// exit if no user / pass
if (!isset($jsonData['user']) || !isset($jsonData['pass'])) {

    exit403('missing field');
}

$user = $jsonData['user'];
$pass = $jsonData['pass'];

$db = new Database();
$pdo = $db->connect();

$sql = "SELECT * FROM users WHERE user = ?";
$stmt = $pdo->prepare($sql);

$status = $stmt->execute(array($user));

if ($status) {
    # get the row containing the user's data
    $result = $stmt->fetch();

    // return the user's id as
    echo json_encode(array('user' => $result['user']));
}

// $query = $pdo->prepare("SELECT * FROM users WHERE user = ?");

// $queryStatus = $query->execute(array($user));

// if ($queryStatus) {
//     $result = $query->fetchAll();
// } else {
//     header('HTTP/1.0 403 Forbidden', true, 403);
//     echo 'forbidden';
// }
