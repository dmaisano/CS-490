DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user VARCHAR(255),
  pass VARCHAR(255),
  type VARCHAR(64),

  PRIMARY KEY(user)
);

-- insert sample users
INSERT INTO users VALUES ("dm583", "foo", "student");
INSERT INTO users VALUES ("calvin", "foo", "instructor");
INSERT INTO users VALUES ("professor", "foo", "instructor");
