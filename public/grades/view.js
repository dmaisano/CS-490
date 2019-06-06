import { AFS_URLS } from '../urls.js';
import { getUser, navigateUrl } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function ViewGradeHandler(root) {
  const grade = getGrade() || null;

  if (grade === null) {
    navigateUrl('#/home');
  }

  root.innerHTML = VIEW_GRADE_PAGE(grade);

  const page = root.querySelector('.exam');

  renderExamQuestions(page, grade);

  if (getUser().type === 'instructor') {
    page.querySelector('.btn#finalize-grade').addEventListener('click', () => {
      finalizeGrade(grade);
    });
  }
}

/**
 * @returns {string}
 */
function VIEW_GRADE_PAGE(grade) {
  return /*html*/ `
  <div class="exam">
  <h2 class="exam-title">Exam: ${grade.exam.exam_name}</h2>

    <div id="exam-questions"></div>

    <button id="finalize-grade" class="btn btn-success hidden">Finalize Grade</button>
  </div>
`;
}

/**
 * @param {HTMLDivElement} page
 * @param {Question[]} questions
 */
function renderExamQuestions(page, grade) {
  const exam = grade.exam;

  const examQuestionsElem = page.querySelector('#exam-questions');

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const points = exam.points[i];
    const points_earned = grade.points_earned[i];
    const response = grade.responses[i];
    const instructor_comments = grade.instructor_comments[i];

    console.log({ points_earned, grade });

    const questionCard = document.createElement('div');
    questionCard.setAttribute('class', 'card question');

    questionCard.innerHTML = /*html*/ `
      <div class="card-title">
        <h2>${question.question_name}</h2>

        <div>points: ${points_earned} / ${points}</div>
      </div>

      <div class="card-body">
        <textarea id="description" rows="6" disabled></textarea>
        <textarea id="code" rows="8" placeholder="Enter Code"></textarea>
        <textarea id="comments" rows="6" placeholder="Instructor Comments"></textarea>
      </div>
    `;

    examQuestionsElem.appendChild(questionCard);

    questionCard.querySelector('#description').value =
      question.question_description;
    questionCard.querySelector('#code').value = response;
    questionCard.querySelector('#comments').value = instructor_comments;
  }
}

/**
 *
 * @param {HTMLDivElement} page
 */
function finalizeGrade(exam) {
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
    url: AFS_URLS,
    user: getUser().id,
    exam,
    responses,
    questions: exam.questions,
    points: exam.points,
  };

  console.log({
    autoGraderRequest: JSON.stringify(autoGraderRequest),
  });
}

function getGrade() {
  return JSON.parse(sessionStorage.getItem('student-grade'));
}
