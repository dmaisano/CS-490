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

// login
const { addQuestion, getQuestions } = require('./questions');
router.post('/questions', getQuestions(database));
router.post('/questions/add', addQuestion(database));

module.exports = router;
