<?php

DEFINE ('DB_USER', 'weblogin');
DEFINE ('DB_PASSWORD', 'test');
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'NJITlogin');

$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
OR die('Connection error ' .
        mysqli_connect_error());

?>
