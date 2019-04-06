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
app.listen(port, () =>
  console.log(`api running: http://localhost:${port}/api`)
);
