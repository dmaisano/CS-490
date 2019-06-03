<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

$code = isset($jsonData['code']); // Answer string stored here
$max_points = isset($jsonData['max points']); // Max points earnable stored here
$topic = isset($jsonData['topic']); // Question topic stored here
$function_name = isset($jsonData['function name']); // Function name stored here
$number_of_questions = isset($jsonData['number of questions']); // Number of questions on exam stored here

$question_results = array();

// Grade a single question
function grade_question($code, $max_points, $topic)
{
    // String search
    if ($code == "") {
        $points_gained = 0;
        return $points_gained;
    } elseif (!preg_match('/(?-i)def +' . $function_name . ':/', $code)) { // Regex for def $function_name: case sensitive
        $points_gained -= 5;
    } else {
        switch ($topic) {
            case "print":
                if (!preg_match('/print/', $code)) {
                    $points_gained -= 5;
                }
                break;
            case "loop":
                if (!preg_match('/for|while/', $code)) {
                    $points_gained -= 5;
                }
                break;
            case "math":
                if (!preg_match('/\+|\-|\*|\/|\%|\=/', $code)) {
                    $points_gained -= 5;
                }
                break;
            case "if":
                if (!preg_match('/if/', $code)) {
                    $points_gained -= 5;
                }
                break;
        }
    }
    // Run function using php.exec()
}

// Sum up question grades
function exam_score($question_results)
{
    if (count($question_results) != 0) {
        $total_score = 0;
        for ($i = 0; $i < count($question_results); $i++) {
            $total_score += $question_results[$i];
        }
        return $total_score;
    } else {
        return 0;
    }
}

// Populate array of question results
while ($number_of_questions != 0) {
    array_push($question_results, grade_question($code, $max_points, $topic));
    $number_of_questions--;
}

// Store results of the exam
$exam_results = exam_score($question_results);

// Curl results to backend
$url = 'https://web.njit.edu/~ld277/490/back/login/grader.php'; // Lawrence's grader table
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $exam_results,
));

$response = curl_exec($curl);
curl_close($curl);
