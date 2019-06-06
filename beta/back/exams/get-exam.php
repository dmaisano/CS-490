<?php

include './database.php';
include './utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new Database();
$pdo = $db->connect();
try {
    $result = array();
    $stmt = $pdo->query('select * from exam_contents c INNER JOIN exams e ON e.id = c.exam_id INNER JOIN questions q ON q.id = c.question_id ORDER BY position');
    while ($row = $stmt->fetch()) {
        array_push($result, $row);
    }
    $response = $result;
} catch (PDOException $error) {
    $response = array('error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}
echo json_encode($response);
