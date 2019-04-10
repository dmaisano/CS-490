USE demo; -- dbName

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  user VARCHAR(255) NOT NULL,
  pass VARCHAR(255),
  type VARCHAR(64),

  PRIMARY KEY(user)
);
