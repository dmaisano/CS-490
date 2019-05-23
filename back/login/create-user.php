<?php

include '../config/database.php';

// ? to run script, type the following: php -f create.php
// ! must CD'd in the users directory

// manually enter credentials
$user = '';
$pass = '';
$type = '';

$hashedPass = password_hash($pass, PASSWORD_DEFAULT);

$db = new Database();
$pdo = $db->connect();

$query = "INSERT INTO users VALUES ('$user', '$hashedPass', '$type')";
$query = $pdo->query($query);

if ($query->rowCount() > 0) {
    echo 'added user';
}
