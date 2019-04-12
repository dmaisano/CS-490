-- USE demo;

DROP TABLE IF EXISTS grades;

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT,

  -- student who took the exam
  student VARCHAR(64) NOT NULL,

  -- instructor who graded the exam (NULLABLE)
  instructor VARCHAR(64),

  -- array of question names
  -- '["Two Sum", "Add Nums", "Concat"]'
  questions TINYTEXT,

  -- array of student's code
  code TEXT,

  -- array of question points (NULLABLE)
  -- '[25, 25, 25, ...]'
  points TINYTEXT,

  -- array of comments
  comments TEXT,

  PRIMARY KEY(id)
);
