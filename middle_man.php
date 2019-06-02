<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$url = $jsonData['url'];

// exit if no url specified
if (!isset($url)) {
    exit404('missing url');
}

// curl to backend
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $jsonString,
));

$response = curl_exec($curl);
curl_close($curl);

echo $response;
