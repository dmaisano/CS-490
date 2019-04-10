USE demo; -- dbName

DROP TABLE IF EXISTS questions;

CREATE TABLE IF NOT EXISTS questions (
  question_name VARCHAR(255), -- name of the question (ie. "Two Sum")
  function_name VARCHAR(64),
  question_description TEXT,
  difficulty VARCHAR(16),
  topic VARCHAR(32),

  PRIMARY KEY(question_name)
);
