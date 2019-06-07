-- questions.sql
DROP TABLE IF EXISTS questions;

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT,
  question_name VARCHAR(255) NOT NULL,
  function_name VARCHAR(255) NOT NULL,
  question_description TEXT NOT NULL,
  difficulty VARCHAR(255) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  test_cases LONGTEXT NOT NULL,

  PRIMARY KEY(id)
);
