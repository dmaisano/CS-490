<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

// Username and Password
$user = isset($jsonData['user']) ? $jsonData['user'] : '';
$pass = isset($jsonData['pass']) ? $jsonData['pass'] : '';

// curls to NJIT
function loginNJIT(string $user, string $pass)
{
    // curl to NJIT
    $curl = curl_init();
    $url = 'https://myhub.njit.edu/vrs/ldapAuthenticateServlet?user_name=' . $user . '&passwd=' . $pass . '&SUBMIT=Login';

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_RETURNTRANSFER => true,
    ));

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    // if HTTP code == 302, user was successfully signed in
    if ($code === 302) {
        return true;
    }

    return false;
}

function loginDB($user, $pass)
{
    $url = 'https://web.njit.edu/~ld277/490/back/login/login.php';

    // create the JSON string object
    $jsonObj = json_encode(array(
        'user' => $user,
        'pass' => $pass,
        'url' => $url,
    ));

    // curl to Backend
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $jsonObj,
    ));

    $response = curl_exec($curl);
    curl_close($curl);

    $response = json_decode($response, true);

    $dbAuth = $response['auth'];
    $dbUser = $response['user'];

    if (isset($dbAuth)) {
        return false;
    }

    if (isset($dbUser)) {
        return true;
    }

    return false;
}

$authNJJIT = loginNJIT($user, $pass);
$authDB = loginDB($user, $pass);

echo json_encode(array(
    'njit' => $authNJJIT,
    'db' => $authDB,
));
