-- books.sql
DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT,
  authors JSON,

  PRIMARY KEY(id)
);
