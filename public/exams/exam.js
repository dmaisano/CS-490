import {
  getUser,
  navigateUrl,
  postRequest,
  Exam,
  removeChildren,
} from '../utils.js';
import { alertModal } from '../modal/modal.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function ExamHandler(root) {
  let exams;

  /** @type {HTMLDivElement} */
  let page;

  const user = getUser();

  console.log(location.hash);

  if (location.hash === '#/exam/view' && user.type !== 'instructor') {
    navigateUrl('#/login');
  }

  try {
    exams = await postRequest('exams');
  } catch (error) {
    alertModal('Get Exams Error', error);
  }

  switch (location.hash) {
    case '#/exam/view':
      SELECT_EXAM_PAGE(root, exams);
      break;

    default:
      navigateUrl('#/login');
      break;
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam[]} exams
 */
function SELECT_EXAM_PAGE(root, exams) {
  root.innerHTML = /*html*/ `
    <div class="select-exam">
      <div class="card">
        <div class="card-title">
          <h2>Exams</h2>
        </div>

        <div class="card-body links"></div>
      </div>
    </div>
  `;

  const links = root.querySelector('.card-body.links');

  for (const exam of exams) {
    const elem = document.createElement('button');
    elem.setAttribute('class', 'btn btn-primary');

    elem.innerHTML = exam.exam_name;

    elem.addEventListener('click', () => {
      if (location.hash === '#/exam/view' && getUser().type === 'instructor') {
        VIEW_EXAM_PAGE(root, exam);
      } else {
        // take exam goes here
      }
    });

    links.appendChild(elem);
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam} exam
 */
function VIEW_EXAM_PAGE(root, exam) {
  root.innerHTML = /*html*/ `
    <div class="exam">
      <h2 class="exam-title">Exam: ${exam.exam_name}</h2>

      <div id="exam-questions"></div>
    </div>
  `;

  renderExam(root.querySelector('#exam-questions'), exam);
}

/**
 * @param {HTMLDivElement} questionBox
 * @param {Exam} exam
 */
function renderExam(questionBox, exam) {
  removeChildren(questionBox);

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const points = exam.points[i];

    const elem = document.createElement('div');
    elem.setAttribute('class', 'card question');

    elem.innerHTML = /*html*/ `
        <div class="card-title">
          <h2>${question.question_name}</h2>

          <h3 class="view-points">points: ${points}</h3>
        </div>

        <div class="card-body">
          <textarea id="description" rows="6" disabled></textarea>
          <textarea id="code" class="${
            location.hash === '#/exam/take' ? '' : 'hidden'
          }" rows="8"></textarea>
        </div>
      `;

    questionBox.appendChild(elem);

    elem.querySelector('#description').value = question.question_description;
  }
}
