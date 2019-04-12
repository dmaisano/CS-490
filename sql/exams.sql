-- USE demo;

DROP TABLE IF EXISTS exams;

CREATE TABLE IF NOT EXISTS exams (
  -- name of the question (ie. "Midterm I")
  exam_name VARCHAR(255),

  -- instructor who created the exam
  instructor VARCHAR(64),

  -- array of question names
  -- '["Two Sum", "Add Nums", "Concat"]'
  question_names TINYTEXT,

  -- array of function names
  -- '["twoSum", "addNums", "concat"]'
  function_names TINYTEXT,

  -- array of question points
  -- '[25, 25, 25, ...]'
  points TINYTEXT,

  -- array of test case objects
  test_cases TEXT,

  PRIMARY KEY(exam_name)
);
