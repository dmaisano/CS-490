-- users.sql
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255),
  pass VARCHAR(255),
  user_type BOOLEAN,

  PRIMARY KEY(id)
);
