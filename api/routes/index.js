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
router.post('/login', getUser(db));

// topics
const { getTopics } = require('../topics');
router.post('/topics', getTopics(db));

// questions
const { getQuestions, addQuestion } = require('../questions');
router.post('/questions', getQuestions(db));
router.post('/questions/add', addQuestion(db));

// exams
const { getExams, addExam } = require('../exams');
router.post('/exams', getExams(db));
router.get('/exams', getExams(db));
router.post('/exams/add', addExam(db));

// grades
const { grader, getGrades, addGrade, updateGrade } = require('../grades');
router.post('/grader', grader(db));
router.post('/grades', getGrades(db));
router.get('/grades', getGrades(db));
router.post('/grades/add', addGrade(db));
router.post('/grades/updateGrade', updateGrade(db));

module.exports = router;
