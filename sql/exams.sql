-- exams.sql
DROP TABLE IF EXISTS exams;

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT,
  exam_name VARCHAR(255) NOT NULL, -- Midterm I
  questions LONGTEXT NOT NULL, -- array of question objects
  points LONGTEXT NOT NULL, -- [50, 50]

  PRIMARY KEY(id)
);
