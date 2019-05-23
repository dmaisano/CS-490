DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  user VARCHAR(255),
  pass VARCHAR(255),

  PRIMARY KEY(user)
);

-- insert test users
INSERT INTO users VALUES ("demo", "foo");
INSERT INTO users VALUES ("test", "bar");
