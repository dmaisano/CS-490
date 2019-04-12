const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// set up routes
app.use('/api', require('./routes'));

require('dotenv').config();
const port = process.env.PORT || 4200;
const ip = process.env.IP || '127.0.0.1';
app.listen(port, ip, () => {
  if (ip === '127.0.0.1') {
    console.log(`api running: http://localhost:${port}/api`);
  } else {
    console.log(`api running: http://${ip}:${port}/api`);
  }
});
