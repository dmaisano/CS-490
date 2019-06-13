<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$exam = $jsonData['exam'];
$responses = $jsonData['responses'];
$questions = $exam['questions'];
$points = $exam['points'];

$jsonData['credit'] = array();
$jsonData['instructor_comments'] = array();

for ($i = 0; $i < count($responses); $i++) {
    $gradeData = grade_question($responses[$i], $questions[$i], $points[$i]);

    array_push($jsonData['credit'], $gradeData['credit']);
    array_push($jsonData['instructor_comments'], $gradeData['comments']);
}

function grade_question($code, $question, $maxPoints)
{
    $test_cases = $question['test_cases'];
    $constraints = $question['constraints'];
    $function_name = $question['function_name'];

    $credit = array(
        'name' => $maxPoints * 0.15,
        'return' => $maxPoints * 0.15,
        'test_case' => $maxPoints * 0.7
    );

    if (in_array("for", $constraints)) {
        $credit = array(
            'name' => $maxPoints * 0.1,
            'for' => $maxPoints * 0.1,
            'return' => $maxPoints * 0.1,
            'test_case' => $maxPoints * 0.7
        );
    }

    $num_test_cases = count($test_cases);

    $comments = "";

    // check if function names match
    preg_match('/\s*def\s+(\w+)\s*\(/', $code, $matches);

    $match = str_replace(array('\'', '"'), '', $matches[1]);

    // replace the function name and take off 25% points
    if ($match != $function_name) {

        $code = str_replace($match, $function_name, $code);
        $credit['name'] = 0;
        $comments = $comments . "messed up function name\n\n";
    }

    // check if return
    if (strpos($code, "return") === false) {
        $credit['return'] = 0;
        $comments = $comments . "missing return statement\n\n";
    }

    // check for FOR loop constraint
    if (in_array("for", $constraints)) {
        if (strpos($code, "for") === false) {
            $credit['for'] = 0;
            $comments = $comments . "missing for loop\n";
        }
    }

    for ($i = 0; $i < $num_test_cases; $i++) {
        $input = $test_cases[$i][0];
        $expected_output = $test_cases[$i][1];

        // create the python file
        file_put_contents("./code.py", $code . "\n\nprint(" . $function_name . "(" . $input . "))");

        // shell_exec saves the output as a string
        $output = shell_exec('python3 ./code.py');

        // output doesnt match expected output
        if (strpos($output, $expected_output) === false) {
            $credit['test_case'] -= $credit['test_case'] / count($num_test_cases);
        }
    }

    return array(
        'credit' => $credit,
        'comments' => $comments
    );
}

// Curl to backend
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "https://web.njit.edu/~ld277/CS-490/back/grades/add.php",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($jsonData)
));

$response = curl_exec($curl);
curl_close($curl);

echo $response;
