<?php

// Baudin Marku CS490

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Receive JSON object
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString, true);

/*
Grader currently does not take into account
student's comments in code response
 */

$code = $jsonData['code']; // Answer string stored here
$max_points = $jsonData['max_points']; // Max points earnable stored here
$topic = $jsonData['topic']; // Question topic stored here
$function_name = $jsonData['function_name']; // Function name stored here
$number_of_questions = $jsonData['number_of_questions']; // Number of questions on exam stored here
$test_cases = $jsonData['test_cases']; // Test cases stored here

$question_results = array();

// Grade a single question
function grade_question($code, $max_points, $topic)
{
    $points_gained = $max_points;
    $minimal_deduction = ($max_points * .25); // Minor errors (syntax / missing keywords) ---- string search
    $extreme_deduction = ($max_points * .5); // If student's output != expected output ---- php exec
    $variable_regex = '[a-zA-Z][a-zA-Z0-9_]*';
    $first_line_regex = '/\Adef +' . $function_name . '\((' . $variable_regex . ')?((, ' . $variable_regex . ')?){0,}\):/'; // Regex for def $function_name(optional parameters):
    $copmarison_operator_regex = '(==)|(!=)|(<>)|>|<|(>=)|(<=)';
    // String search
    if ($code == "") {
        $points_gained = 0;
        return $points_gained;
    } else {
        if (!preg_match($first_line_regex, $code)) {
            $points_gained -= $minimal_deduction;
        }
        switch ($topic) {
            case "Dict":
                if (!preg_match('/' . $variable_regex . ' *= *{(".*": ".*".*)?}/', $code)) { // dict1 = {"key": "yes"}
                    $points_gained -= $minimal_deduction;
                }
                break;
            case "Files":
                if (!preg_match('/' . $variable_regex . ' *= *open\(".+\.((txt)|(php)|(py))"(, "[rawx]")?\)/', $code)) { // file = open("cat.txt", "w") (only .txt .php .py allowed)
                    $points_gained -= $minimal_deduction;
                }
                break;
            case "If":
                if (!preg_match('/if ' . $variable_regex . ' *(' . $copmarison_operator_regex . ')?.*:/', $code)) { // if variable: || if variable1 > variable2:
                    $points_gained -= $minimal_deduction;
                }
                break;
            case "Lists":
                if (!preg_match('/' . $variable_regex . ' *= *\[(".+"){0,}\]/', $code)) { // list1 = [1, "apple"] etc.
                    $points_gained -= $minimal_deduction;
                }
                break;
            case "Loops":
                if (preg_match('/for/', $code)) { // check for loop syntax
                    if (!preg_match('/for *' . $variable_regex . ' *in *' . $variable_regex . ' *:/')) { // for x in fruits:
                        $points_gained -= $minimal_deduction;
                    }
                }
                if (preg_match('/while/', $code)) { // check while loop syntax
                    if (!preg_match('/while ' . $variable_regex . ' *(' . $copmarison_operator_regex . ')?.*:/', $code)) { // while x < 10:
                        $points_gained -= $minimal_deduction;
                    }
                }
                break;
            case "Math":
                $arithmetic_operator_regex = '\+|-|\*|\/|%';
                if (!preg_match('/' . $arithmetic_operator_regex . '/', $code)) {
                    $points_gained -= $minimal_deduction;
                }
                break;
            case "Strings":
                if (!preg_match('/".*"/', $code)) {
                    $points_gained -= $minimal_deduction;
                }
                break;
        }
    }
    // Write the code to a file and run the function using php shell_exec()
    $file = fopen('code.py', 'w');
    fwrite($file, $code); // Code is overwritten in file for each question
    for ($i = 0; $i < count($test_cases); $i++) {
        $input = $test_cases[$i][0];
        $expected_output = $test_cases[$i][1];
        fwrite($file, '\nprint(' . $function_name . '(' . $input . '))'); // print(doubleIt(2))
        $output = shell_exec('/~/Programs/490/' . $file);
        if ($expected_output !== $output) {
            $points_gained -= $extreme_deduction;
        }
    }
    fclose($file);
    return $points_gained;
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
