<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$url = $jsonData['url'];
$user = $jsonData['user'];
$responses = $jsonData['responses'];
$points = $jsonData['points'];
$questions = $jsonData['questions'];

$jsonData['points_earned'] = array();
$jsonData['instructor_comments'] = array();

for ($i = 0; $i < count($responses); $i++) {
    $gradeData = grade_question($responses[$i], $questions[$i], $points[$i]);

    array_push($jsonData['points_earned'], $gradeData['points']);
    array_push($jsonData['instructor_comments'], $gradeData['comments']);
}

// Curl results to backend
$url = 'https://web.njit.edu/~ld277/490/back/grade/auto-grade.php'; // Lawrence's grader table
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $gradeData,
));

$response = curl_exec($curl);
curl_close($curl);

function grade_question($code, $question, $maxPoints)
{
    $points = $maxPoints;
    $test_cases = $question['test_cases'];
    $function_name = $question['function_name'];

    $current_points = $points / count($test_cases);

    $num_test_cases = count($test_cases);

    $comments = "";

    for ($i = 0; $i < $num_test_cases; $i++) {
        $input = $test_cases[$i][0];
        $expected_output = $test_cases[$i][1];

        // check if function names match
        preg_match('/\s*def\s+(\w+)\s*\(/', $code, $matches);

        $match = str_replace(array('\'', '"'), '', $matches[1]);

        if ($match != $function_name) {
            // replace the function name and take off 25% points
            $code = str_replace($match, $function_name, $code);
            $points -= $maxPoints * .25;
            $comments = $comments . "messed up function name\n";
        }

        // create the python file
        file_put_contents("./code.py", $code . "\n\nprint(" . $function_name . "(" . $input . "))");

        // shell_exec saves the output as a string
        $output = shell_exec('python3 ./code.py');

        if (strpos($output, $expected_output) === false) {
            $points -= $maxPoints / $num_test_cases;
        }
    }

    // prevent negative points
    if ($points < 0) {
        $points = 0;
    }

    // round the points up
    $points = ceil($points);

    return array(
        'points' => $points,
        'comments' => $comments,
    );
}

// Curl to backend
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
