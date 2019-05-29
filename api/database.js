const mysql = require('mysql');
const { promisify } = require('util');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.query = promisify(db.query);

exports.database = db;
