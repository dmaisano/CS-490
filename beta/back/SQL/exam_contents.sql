-- exam_contents.sql
DROP TABLE IF EXISTS exam_contents;

CREATE TABLE
IF NOT EXISTS exam_contents
(
  exam_id INT,
  question_id INT, -- [1, 3]
  position INT, -- Question #2
  points INT,
  FOREIGN KEY
(exam_id) REFERENCES exams
(id),
  FOREIGN KEY
(question_id) REFERENCES questions
(id)
);