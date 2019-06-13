-- grades.sql
DROP TABLE IF EXISTS grades;

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT,
  student_id VARCHAR(255) NOT NULL,
  exam LONGTEXT NOT NULL,
  responses LONGTEXT NOT NULL,
  instructor_comments LONGTEXT NOT NULL,
  credit LONGTEXT NOT NULL,
  finalized BOOLEAN NOT NULL,

  PRIMARY KEY(id)
);
