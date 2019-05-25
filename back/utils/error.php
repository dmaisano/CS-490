<?php

function exit403(string $msg = '')
{
    header('HTTP/1.0 403 Forbidden', true, 403);

    if ($msg) {
        echo $msg;
    }

    exit(403);
}
