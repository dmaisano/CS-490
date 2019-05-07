import {
  renderExamLinks,
  selectExam,
  renderStudentLinks,
} from '../scripts/exams.js';
import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { getUser } from '../scripts/utils.js';

const examType = sessionStorage.getItem('exam-type');

window.viewExam = viewExam;
window.submitExam = submitExam;

let exams = [];
let selectedExam = {};
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

  let url;

  switch (examType) {
    case 'view-exams':
      url = urls.getExams;
      break;

    case 'take-exam':
      url = urls.getExams;
      break;

    case 'instructor-grades':
      url = urls.getGrades;
      break;

    case 'student-grades':
      url = urls.getGrades;
      break;

    default:
      break;
  }

  return postObj(url, getUser())
    .then(res => res.json())
    .then(res => {
      exams = res;
    })
    .then(() => {
      switch (examType) {
        case 'instructor-grades':
          renderStudentLinks(
            document.querySelector('.student-links .container')
          );
          break;

        default:
          renderExamLinks(
            exams,
            document.querySelector('.exam-links .container')
          );
          break;
      }
    });
}

/**
 * Choose the exam to view / take / grade
 * @param {number} index
 */
async function viewExam(examName = null) {
  console.log({
    examName,
  });

  if (examName === null) return;

  let foo = await postObj(urls.getExams, {
    user: 'professor',
    type: 'instructor',
  });
  foo = await foo.json();

  for (const bar of foo) {
    if (bar.exam_name == examName) {
      selectedExam = bar;
      break;
    }
  }

  // selectedExam = exams[index];

  selectExam(selectedExam, document.querySelector('.exam-links'), examType);
}

// handle the mode based on 'exam-type'
function pageHandler() {
  const exam = document.querySelector('.exam > .card > .card-body');

  const submitBtn = document.createElement('button');

  switch (examType) {
    case 'take-exam':
      submitBtn.setAttribute('type', 'button');
      submitBtn.setAttribute('class', 'btn btn-success');
      submitBtn.setAttribute('onclick', 'submitExam()');
      submitBtn.innerHTML = `Submit Exam`;

      exam.appendChild(submitBtn);
      break;

    case 'instructor-grades':
      submitBtn.setAttribute('type', 'button');
      submitBtn.setAttribute('class', 'btn btn-success');
      submitBtn.setAttribute('onclick', 'updateGrade()');
      submitBtn.innerHTML = `Update Grade`;

      exam.appendChild(submitBtn);
      break;

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

  let gradeData = await postObj(urls.grader, {
    function_names,
    test_cases,
    question_constraints,
    ...selectedExam,
    code,
  });
  gradeData = await gradeData.json();

  gradeData = {
    user,
    student: user.user,
    instructor: selectedExam.instructor,
    ...gradeData,
    ...selectedExam,
  };

  postObj(urls.addGrade, gradeData)
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        alert('Failed To Submit Exam');
        console.error(res);
        return;
      }

      alert(`Successfully Submitted Exam ${selectedExam.exam_name}`);
    });
}
