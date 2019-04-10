USE demo; -- dbName

DROP TABLE IF EXISTS topics;

CREATE TABLE IF NOT EXISTS topics (
  topic VARCHAR(64),

  PRIMARY KEY(topic)
);
