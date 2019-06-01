<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$user = $jsonData['user'];
$pass = $jsonData['pass'];

// exit if no user / pass
if (!isset($user) || !isset($pass)) {
    exit404('missing field');
}

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "SELECT * FROM users WHERE user_id=:user_id";
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':user_id', $user);
    $stmt->execute();

    $result = $stmt->fetch();

    if ($result) {
        $hashedPass = $result['pass'];

        // check if passwords match
        if (password_verify($pass, $hashedPass)) {
            $response = array('user' => $user);
        } else {
            header('HTTP/1.0 403 Forbidden');
            $response = array('auth' => false);
        }
    } else {
        header('HTTP/1.0 403 Forbidden');
        $response = array('auth' => false);
    }
} catch (PDOException $error) {
    header('HTTP/1.1 500 Internal Server Error');
    $response = array('error' => $error);
    echo json_encode($response);
}

echo json_encode($response);
