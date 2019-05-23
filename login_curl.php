<?php

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

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://aevitepr2.njit.edu/myhousing/login.cfm");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, true);

curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
$njitResponse = curl_exec($ch);
curl_close($ch);
