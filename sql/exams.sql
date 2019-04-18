DROP TABLE IF EXISTS exams;

CREATE TABLE exams (
  id INT AUTO_INCREMENT,

  exam_name VARCHAR(255) NOT NULL,

  -- instructor who created the exam
  instructor VARCHAR(64) NOT NULL,

  -- JSON array of question ids
  question_ids TINYTEXT NOT NULL,

  -- JSON array of max points per questions
  points_max TINYTEXT NOT NULL,

  PRIMARY KEY(id)
);
