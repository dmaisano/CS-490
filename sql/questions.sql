DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id INT AUTO_INCREMENT,

  question_name VARCHAR(255)  NOT NULL,

  function_name VARCHAR(64)  NOT NULL,

  question_description TEXT  NOT NULL,

  difficulty VARCHAR(16)  NOT NULL,

  topic VARCHAR(32)  NOT NULL,

  -- can be empty string
  question_constraints VARCHAR(32),

  -- JSON array of test case objects
  test_cases TEXT NOT NULL,

  PRIMARY KEY(id)
);
