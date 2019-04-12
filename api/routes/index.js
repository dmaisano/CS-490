const router = require('express').Router();

const db = require('../database');

db.connect();

router.get('/', (req, res) => {
  res.json({
    success: true,
    msg: 'express api works',
  });
});

// user
const { getUser } = require('../users');
router.post('/user', getUser(db));

// topics
const { getTopics } = require('../topics');
router.post('/topics', getTopics(db));

// questions
const { getQuestions, addQuestion } = require('../questions');
router.post('/questions', getQuestions(db));
router.post('/questions/add', addQuestion(db));

module.exports = router;
