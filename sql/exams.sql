-- exams.sql
DROP TABLE IF EXISTS exams;

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT,
  exam_name VARCHAR(255) NOT NULL, -- Midterm I
  student_id VARCHAR(255),
  questions LONGTEXT NOT NULL, -- array of question objects
  responses LONGTEXT,
  instructor_comments LONGTEXT,
  points LONGTEXT NOT NULL, -- [50, 50]
  points_earned LONGTEXT,
  finalized BOOLEAN NOT NULL,
  reference_exam BOOLEAN NOT NULL, -- view only exam

  PRIMARY KEY(id)
);
