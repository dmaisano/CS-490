const router = require('express').Router();
const { database } = require('./database');

database.connect();

router.get('/', (req, res) => {
  res.json({
    success: true,
    msg: 'express api works',
  });
});

// login
const { login } = require('./login');
router.post('/login', login(database));

module.exports = router;
