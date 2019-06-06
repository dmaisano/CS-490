-- grades.sql
DROP TABLE IF EXISTS grades;

CREATE TABLE
IF NOT EXISTS grades
(
  id INT AUTO_INCREMENT,
  exam_id INT,
  student_id VARCHAR
(255),
  responses JSON,
  instructor_comments JSON,
  points_earned JSON, -- [25, 50]
  finalized BOOLEAN,
  PRIMARY KEY
(id),
  FOREIGN KEY
(student_id) REFERENCES users
( id),
  FOREIGN KEY
(exam_id) REFERENCES exams
(id)
);
