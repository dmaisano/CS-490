-- USE demo;

DROP TABLE IF EXISTS grades;

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT,

  student VARCHAR(64) NOT NULL,

  -- instructor who graded the exam (NULLABLE)
  instructor VARCHAR(64),

  -- array of question names
  -- '["Two Sum", "Add Nums", "Concat"]'
  questions TINYTEXT,

  -- array of question points
  -- '[25, 25, 25, ...]'
  points TINYTEXT,

  -- array of test case objects
  test_cases TEXT,

  PRIMARY KEY(id)
);
