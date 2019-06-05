<?php

// exec example

$code = "def doubleIt(num):\n  return num * 2";

$points = 100;

$function_name = "foo";

preg_match('/\s*def\s+(\w+)\s*\(/', $code, $matches);

$match = str_replace(array('\'', '"'), '', $matches[1]);

if ($match != $function_name) {
    // replace the function name and take off 25% points
    $code = str_replace($match, $function_name, $code);
}

file_put_contents("./code.py", $code);

file_put_contents("./code.py", "\n\nprint(" . $function_name . "(2))", FILE_APPEND);

// shell_exec saves the output as a string
$output = shell_exec('python3 ./code.py');

print($output);
