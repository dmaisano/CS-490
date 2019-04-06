const router = require('express').Router();

const db = require('../database');

db.connect();

// user logic
const { getUser } = require('../users');
router.post('/user', getUser(db));

module.exports = router;
