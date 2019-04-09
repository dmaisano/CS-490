USE demo; -- dbName

CREATE TABLE IF NOT EXISTS questions (
  id int NOT NULL AUTO_INCREMENT,
  difficulty VARCHAR(16),
  topic VARCHAR(32),
  question_name VARCHAR(255), -- name of the question (ie. "Two Sum")
  function_name VARCHAR(64),
  question_description TEXT,

  PRIMARY KEY(id)
);
