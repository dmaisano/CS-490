USE demo; -- dbName

CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  type VARCHAR(64),
  username VARCHAR(255),
  pass VARCHAR(255),

  PRIMARY KEY(id)
);
