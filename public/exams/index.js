import { renderExamLinks, selectExam } from '../scripts/exams.js';
import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { getUser } from '../scripts/utils.js';

window.viewExam = viewExam;
window.submitExam = submitExam;

let exams = [];
// let selectedExam = {};
let user = {};

(function() {
  redirect().then(() => {
    user = getUser();

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

function submitExam() {
  const student_responses = [];

  let elem = document.querySelectorAll('.questions .code');
  for (let i = 0; i < elem.length; i++) {
    const codebox = elem[i];
    const response = codebox.value || '';

    if (response === '') {
      alert('Missing Response(s)');
      return;
    }

    student_responses.push(response);
  }

  // postObj(urls.grader, {
  //   user,
  //   student_responses,
  // })
  //   .then(res => res.json())
  //   .res(res => {
  //     console.log(res);
  //   })
  //   .catch(err => {
  //     alert('Failed to Submit Exam');
  //     console.error(err);
  //     return;
  //   });
}
