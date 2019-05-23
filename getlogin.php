<?php

require_once('../mysqli_connect.php');

$json = array(
  'success'   => false,
  'db'        => 'local'
  'id'        => NULL,
  'password'  => NULL
);


$query = "SELECT id FROM users WHERE id = '" + json['id'] + "' ;"

 ?>
