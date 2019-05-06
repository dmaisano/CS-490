DROP TABLE IF EXISTS grades;

CREATE TABLE grades (
  id INT AUTO_INCREMENT,

  -- name of the question (ie. "Midterm I")
  exam_name VARCHAR(255),

  -- student who took the exam
  student VARCHAR(64) NOT NULL,

  -- instructor who is leaving comments / feedback
  instructor VARCHAR(64),

  -- JSON array of question ids
  question_ids TINYTEXT NOT NULL,

  -- JSON array of student's code
  student_responses TEXT,

  -- JSON array of instructor comments
  instructor_comments TEXT,

  -- JSON array of max points per questions
  points_earned TINYTEXT NOT NULL,

  -- JSON array of max points per questions
  points_max TINYTEXT NOT NULL,

  PRIMARY KEY(id)
);
