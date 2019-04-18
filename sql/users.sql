DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user VARCHAR(255),
  pass VARCHAR(255),
  type VARCHAR(64),

  PRIMARY KEY(user)
);
