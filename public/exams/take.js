import { DEV_URLS } from '../urls.js';
import { getUser, navigateUrl, postRequest } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function TakeExamHandler(root) {
  const exam = getExam() || null;

  if (exam === null) {
    navigateUrl('#/home');
  }

  root.innerHTML = TAKE_EXAM_PAGE(exam);

  const page = root.querySelector('.exam');

  renderExamQuestions(page, exam);

  page.querySelector('.btn#submit-exam').addEventListener('click', () => {
    submitExam(exam);
  });
}

/**
 * @returns {string}
 */
function TAKE_EXAM_PAGE(exam) {
  return /*html*/ `
  <div class="exam">
  <h2 class="exam-title">Exam: ${exam.exam_name}</h2>

    <div id="exam-questions"></div>

    <button id="submit-exam" class="btn btn-success">Submit Exam</button>
  </div>
`;
}

/**
 * @param {HTMLDivElement} page
 * @param {Question[]} questions
 */
function renderExamQuestions(page, exam) {
  const examQuestionsElem = page.querySelector('#exam-questions');

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const points = exam.points[i];

    const questionCard = document.createElement('div');
    questionCard.setAttribute('class', 'card question');

    questionCard.innerHTML = /*html*/ `
      <div class="card-title">
        <h2>${question.question_name}</h2>

        <div>points: ${points}</div>
      </div>

      <div class="card-body">
        <textarea id="description" rows="6" disabled></textarea>
        <textarea id="code" rows="8" placeholder="Enter Code"></textarea>
      </div>
    `;

    examQuestionsElem.appendChild(questionCard);

    questionCard.querySelector('#description').value =
      question.question_description;
  }
}

/**
 *
 * @param {HTMLDivElement} page
 */
function submitExam(exam) {
  let responses = [];

  for (const elem of document.querySelectorAll('#code')) {
    const response = elem.value || '';

    if (response == '') {
      alert('Missing Code');
      return;
    }

    responses.push(response);
  }

  const autoGraderRequest = {
    url: DEV_URLS.addGrade,
    user: getUser().id,
    exam,
    responses,
    questions: exam.questions,
    points: exam.points,
  };

  console.log(autoGraderRequest);

  // postRequest(
  //   'https://web.njit.edu/~bm424/490/middle/grader.php',
  //   autoGraderRequest
  // ).then(res => {
  //   console.log(res);
  // });
}

function getExam() {
  return JSON.parse(sessionStorage.getItem('student-exam-take'));
}
