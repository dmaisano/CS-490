<?php

include '../beta/back/config/database.php';
include '../beta/back/utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new Database();
$pdo = $db->connect();

try {
    $result = array();

    $stmt = $pdo->query("SELECT * FROM books");

    while ($row = $stmt->fetch()) {
        array_push($result, $row);
    }

    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
