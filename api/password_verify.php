<?php

// returns whether or not the password hash matches

if (!isset($argv[1]) || !isset($argv[2])) {
    echo 'false';
    return;
}

$plainTextPass = $argv[1];
$hashedPass = $argv[2];

$match = password_verify($plainTextPass, $hashedPass);

if ($match == true) {
    echo 'true';
} else {
    echo 'false';
}
