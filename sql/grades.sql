-- grades.sql
DROP TABLE IF EXISTS grades;

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT,
  exam JSON, -- exam object
  student_id VARCHAR(255),
  responses JSON,
  instructor_comments JSON,
  points JSON, -- [50, 50]
  points_earned JSON, -- [25, 50]
  finalized BOOLEAN,

  PRIMARY KEY(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);
