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

// Setup NJIT cURL handler and execute
$ch1 = curl_init();
curl_setopt($ch1, CURLOPT_URL, "https://aevitepr2.njit.edu/myhousing/login.cfm");
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch1, CURLOPT_POST, true);
curl_setopt($ch1, CURLOPT_POSTFIELDS, $jsonData);
$njitResponse = curl_exec($ch1);

// Check for errors and close
if ($njitResponse == false) {
    echo 'Response Error:' . curl_error($ch1);
}
curl_close($ch1);

// Setup backend cURL handler and execute
$ch2 = curl_init();
curl_setopt($ch2, CURLOPT_URL, "https://web.njit.edu/~ld277/");
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_POSTFIELDS, $jsonData);
$backendResponse = curl_exec($ch2);

// Check for errors and close
if ($backendResponse === false) {
    echo 'Response Error:' . curl_error($ch2);
}
curl_close($ch2);

// Convert JSON to PHP array
$njitJSONData = json_decode($njitResponse, true);
$backendJSONData = json_decode($backendResponse, true);

// Setup frontend cURL handler and execute
$ch3 = curl_init();
curl_setopt($ch3, CURLOPT_URL, "https://web.njit.edu/~dm000/"); // Dom's ucid
curl_setopt($ch3, CURLOPT_POST, true);
curl_setopt($ch3, CURLOPT_POSTFIELDS, $njitJSONData); // + backend JSON data
$frontendResponse = curl_exec($ch3);
curl_close($ch3);
