-- exams.sql
DROP TABLE IF EXISTS exams;

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT,
  exam_name VARCHAR(255), -- Midterm I
  question_ids JSON, -- [1, 3]
  points JSON, -- [50, 50]

  PRIMARY KEY(id)
);
