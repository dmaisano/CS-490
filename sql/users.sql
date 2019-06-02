-- users.sql
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255),
  pass VARCHAR(255) NOT NULL,
  type ENUM('student', 'instructor') NOT NULL,

  PRIMARY KEY(id)
);

-- Sample Users
-- INSERT INTO users VALUES ('dm583', 'foo', 'student');
-- INSERT INTO users VALUES ('itani', 'foo', 'instructor');
