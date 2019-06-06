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

// topics
const { getTopics } = require('./topics');
router.post('/topics', getTopics(database));

// questions
const { addQuestion, getQuestions } = require('./questions');
router.post('/questions', getQuestions(database));
router.post('/questions/add', addQuestion(database));

// exams
const { addExam, getExams } = require('./exams');
router.post('/exams', getExams(database));
router.post('/exams/add', addExam(database));

module.exports = router;
