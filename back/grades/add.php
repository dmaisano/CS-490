<?php

include '../config/database.php';
include '../utils.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

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

function grade_question($code, $question, $maxPoints)
{
    $points = $maxPoints;
    $test_cases = $question['test_cases'];
    $constraints = $question['constraints'];
    $function_name = $question['function_name'];

    $current_points = $points / count($test_cases);

    $num_test_cases = count($test_cases);

    $comments = "";

    // check if function names match
    preg_match('/\s*def\s+(\w+)\s*\(/', $code, $matches);

    $match = str_replace(array('\'', '"'), '', $matches[1]);

    if ($match != $function_name) {
        // replace the function name and take off 25% points
        $code = str_replace($match, $function_name, $code);
        $points -= $maxPoints * .25;
        $comments = $comments . "messed up function name\n";
    }

    // check for FOR loop constraint
    if (in_array("for", $constraints)) {
        if (strpos($code, "for") === false) {
            $points -= $maxPoints * .25;
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
        'comments' => $comments
    );
}

$exam_name = $jsonData['exam_name'];
$student_id = $jsonData['student_id'];
$questions = $jsonData['questions'];
$responses = $jsonData['responses'];
$instructor_comments = $jsonData['instructor_comments'];
$points = $jsonData['points'];
$points_earned = $jsonData['points_earned'];
$finalized = 1;
$reference_exam = 0;

$db = new Database();
$pdo = $db->connect();

try {
    $sql = "INSERT INTO exams (exam_name, student_id, questions, responses, instructor_comments, points, points_earned, finalized, reference_exam) VALUES (?,?,?,?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);

    $args = array(
        $exam_name,
        $student_id,
        json_encode($questions),
        json_encode($responses),
        json_encode($instructor_comments),
        json_encode($points),
        json_encode($points_earned),
        $finalized,
        $reference_exam
    );

    $status = $stmt->execute($args);

    $response = array('success' => true, 'msg' => 'successfully added grade for ' . $student_id);
} catch (PDOException $error) {
    $response = array('success' => false, 'error' => $error);
    header('HTTP/1.1 500 Internal Server Error');
}

echo json_encode($response);
