<?php

// sends a 404 status and exits
function exit404(string $msg)
{
    header("HTTP/1.0 404 Not Found");
    echo json_encode(array(
        'err' => $msg,
    ));
    die();
}
