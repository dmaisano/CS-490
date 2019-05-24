<?php
// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

// Exit if no username or password
if (!isset($jsonData['user']) || !isset($jsonData['pass'])) {
    header('HTTP/1.0 403 Forbidden', true, 403);
    echo 'Missing Field';
    exit(403);
}

// Successfully grabbed username and password
$user = $jsonData['user'];
$pass = $jsonData['pass'];

// Setup NJIT cURL handler
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://aevitepr2.njit.edu/myhousing/login.cfm");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, true);

curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
$njitResponse = curl_exec($ch);

// Check for errors
if ($njitResponse == false) {
    echo 'Response Error:' . curl_error($ch);
}

curl_close($ch);

// Convert JSON to PHP array
$njitJSONData = json_decode($njitResponse, true);

// Setup backend cURL handler
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://web.njit.edu/~ld277/");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, true);

curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
$backendResponse = curl_exec($ch);

// Check for errors
if ($backendResponse === false) {
    echo 'Response Error:' . curl_error($ch);
}

curl_close($ch);

// Convert JSON to PHP array
$backendJSONData = json_decode($backendResponse, true);
