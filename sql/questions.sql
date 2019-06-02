-- questions.sql
DROP TABLE IF EXISTS questions;

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT,
  question_name VARCHAR(255),
  function_name VARCHAR(255),
  question_description TEXT,
  difficulty VARCHAR(255),
  topic VARCHAR(255), -- for loop, math, etc
  test_cases JSON, -- json_decode(test_cases)

  PRIMARY KEY(id)
);
