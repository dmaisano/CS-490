<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$user = isset($jsonData['user']) ? $jsonData['user'] : '';
$pass = isset($jsonData['pass']) ? $jsonData['pass'] : '';

$authNJJIT = loginNJIT($user, $pass);
$authDB = loginDB($user, $pass);

echo json_encode(array('auth' => array(
    'njit' => $authNJJIT,
    'db' => $authDB,
)));

// curls to NJIT
function loginNJIT(string $user, string $pass)
{
    // curl to NJIT
    $curl = curl_init();
    $url = 'https://myhub.njit.edu/vrs/ldapAuthenticateServlet?user_name=' . $user . '&passwd=' . $pass . '&SUBMIT=Login';

    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    // is HTTP code == 302, user was successfully signed in
    if ($code === 302) {
        return true;
    }

    return false;
}

function loginDB(string $user, string $pass)
{
    // curl to NJIT
    $curl = curl_init();
    $url = 'https://example.com';

    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => array(
            'user' => $user,
            'pass' => $pass,
        ),
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 3,
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($curl);
    curl_close($curl);

    $jsonData = json_decode($response);

    $dbUser = $jsonData['user'];
    $dbAuth = $jsonData['auth'];

    if (isset($dbAuth) && $dbAuth == false) {
        return false;
    }

    if (isset($dbUser)) {
        return true;
    }

    return false;
}
