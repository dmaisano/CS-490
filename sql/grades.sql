DROP TABLE IF EXISTS grades;

CREATE TABLE grades (
  id INT AUTO_INCREMENT,

  -- name of the question (ie. "Midterm I")
  exam_name VARCHAR(255),

  -- student who took the exam
  student VARCHAR(64) NOT NULL,

  -- instructor who created the exam (NULLABLE)
  instructor VARCHAR(64),

  -- JSON array of question ids
  questions_ids TINYTEXT NOT NULL,

  -- JSON array of max points per questions
  points_earned TINYTEXT NOT NULL,

  -- JSON array of max points per questions
  points_max TINYTEXT NOT NULL,

  PRIMARY KEY(id)
);
