import { renderExamLinks, selectExam } from '../scripts/exams.js';
import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { getUser } from '../scripts/utils.js';

window.viewExam = viewExam;
window.submitExam = submitExam;

let exams = [];
let selectedExam = {};
let user = {};

(function() {
  redirect().then(() => {
    user = getUser();

    console.log(user);

    getExams(user);

    pageHandler();
  });
})();

/**
 * get the exams from the DB
 */
function getExams(user = null) {
  if (user === null) return;

  // get the list of exams
  return postObj(urls.getExams, user)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      exams = res;
    })
    .then(() => {
      renderExamLinks(exams, document.querySelector('.exam-links .container'));
    });
}

/**
 * Choose the exam to view / take / grade
 * @param {number} index
 */
function viewExam(index = null) {
  if (index === null) return;

  const examType = sessionStorage.getItem('exam-type');

  selectedExam = exams[index];
  selectExam(exams, index, document.querySelector('.exam-links'), examType);
}

// handle the mode based on 'exam-type'
function pageHandler() {
  const exam = document.querySelector('.exam > .card > .card-body');
  const examType = sessionStorage.getItem('exam-type');

  switch (examType) {
    case 'take-exam':
      const submitBtn = document.createElement('button');
      submitBtn.setAttribute('type', 'button');
      submitBtn.setAttribute('class', 'btn btn-success');
      submitBtn.setAttribute('onclick', 'submitExam()');
      submitBtn.innerHTML = `Submit Exam`;

      exam.appendChild(submitBtn);
      break;

    case 'view-grade':
      break;

    // view exam
    default:
      break;
  }
}

async function submitExam() {
  const code = [];

  let elem = document.querySelectorAll('.questions .code');
  for (let i = 0; i < elem.length; i++) {
    const codebox = elem[i];
    const response = codebox.value || '';

    if (response === '') {
      alert('Missing Response(s)');
      return;
    }

    code.push(response);
  }

  let questions = await postObj(urls.getQuestions, selectedExam.question_ids);
  questions = await questions.json();

  const question_constraints = [];
  const test_cases = [];
  const function_names = [];

  for (const question of questions) {
    function_names.push(question.function_name);
    test_cases.push(question.test_cases);
    question_constraints.push(question.question_constraints);
  }

  console.log({
    user,
    function_names,
    test_cases,
    question_constraints,
    ...selectedExam,
    code,
  });

  let gradeData = await postObj(urls.grader, {
    user,
    function_names,
    test_cases,
    question_constraints,
    ...selectedExam,
    code,
  });
  gradeData = await gradeData.json();

  const earnedPoints = gradeData.points_earned.reduce(
    (total, points) => (total += points)
  );

  alert(`Earned ${earnedPoints} / 100`);

  console.log(gradeData);
}
