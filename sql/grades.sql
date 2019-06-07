-- grades.sql
DROP TABLE IF EXISTS grades;

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT,
  exam LONGTEXT, -- exam object
  student_id VARCHAR(255),
  responses LONGTEXT,
  instructor_comments LONGTEXT,
  points LONGTEXT, -- [50, 50]
  points_earned LONGTEXT, -- [25, 50]
  finalized BOOLEAN,

  PRIMARY KEY(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);
