-- users.sql
DROP TABLE IF EXISTS demo_users;

CREATE TABLE IF NOT EXISTS demo_users (
  id VARCHAR(255),
  pass VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,

  PRIMARY KEY(id)
);
