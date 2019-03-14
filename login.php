<?php
$json = json_decode(file_get_contents('php://input'), true);
// get user creds
$user = isset($json["user"]) ? $json["user"] : "NULL";
$pass = isset($json["pass"]) ? $json["pass"] : "NULL";
if ($user != "NULL" && "pass") {
    header('Content-Type: application/json');
    echo json_encode(array(
        "id" => "1",
        "type" => "student",
        "user" => $user,
        "pass" => $pass,
    ));
} else {
    header('HTTP/1.0 403 Forbidden');
    echo "<h1>Not Authorized</h1>";
}
