-- topics.sql
DROP TABLE IF EXISTS topics;

CREATE TABLE IF NOT EXISTS topics (
  topic VARCHAR(255),

  PRIMARY KEY(topic)
);

INSERT INTO topics VALUES ("Dict");
INSERT INTO topics VALUES ("Files");
INSERT INTO topics VALUES ("Functions");
INSERT INTO topics VALUES ("If");
INSERT INTO topics VALUES ("Lists");
INSERT INTO topics VALUES ("Loops");
INSERT INTO topics VALUES ("Math");
INSERT INTO topics VALUES ("Strings");
