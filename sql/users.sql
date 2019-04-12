-- USE demo; -- dbName

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user VARCHAR(255) NOT NULL,
  pass VARCHAR(255),
  type VARCHAR(64),

  PRIMARY KEY(user)
);


INSERT INTO users VALUES ("dm583", "foo", "student");
INSERT INTO users VALUES ("professor", "foo", "instructor");
