import { alertModal } from '../modal/modal.js';
import {
  Exam,
  getUser,
  navigateUrl,
  postRequest,
  removeChildren,
} from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function ExamHandler(root) {
  const user = getUser();

  if (location.hash === '#/exam/view' && user.type !== 'instructor') {
    navigateUrl('#/home');
  }

  switch (location.hash) {
    case '#/exam/view':
      SELECT_EXAM_PAGE(root);
      break;

    case '#/exam/take':
      SELECT_EXAM_PAGE(root);
      break;

    default:
      navigateUrl('#/home');
      break;
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam[]} exams
 */
async function SELECT_EXAM_PAGE(root) {
  let exams;
  let grades;
  let validExams = [];

  const user = getUser();

  try {
    exams = await postRequest('exams', {
      user,
    });

    grades = await postRequest('grades', {
      user,
    });
  } catch (error) {
    alertModal('Get Exams Error', error);
  }

  if (grades.length >= 1) {
    for (const exam of exams) {
      for (let i = 0; i < grades.length; i++) {
        const grade = grades[i];

        if (exam.id === grade.exam.id) {
          break;
        }

        if (i === grades.length - 1) {
          validExams.push(exam);
        }
      }
    }
  } else {
    validExams = exams;
  }

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

  if (validExams.length < 1) {
    const elem = document.createElement('button');
    elem.setAttribute('class', 'btn btn-primary');
    elem.setAttribute('disabled', '');

    elem.innerHTML = 'No Exams';

    links.appendChild(elem);
    return;
  }

  for (const exam of validExams) {
    const elem = document.createElement('button');
    elem.setAttribute('class', 'btn btn-primary');

    elem.innerHTML = exam.exam_name;

    elem.addEventListener('click', () => {
      EXAM_PAGE(root, exam);
    });

    links.appendChild(elem);
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam} exam
 */
function EXAM_PAGE(root, exam) {
  const action = location.hash === '#/exam/take' ? 'take' : 'view';

  root.innerHTML = /*html*/ `
    <div class="exam">
      <h2 class="exam-title">Exam: ${exam.exam_name}</h2>

      <div id="exam-questions"></div>

      <button type="button" id="submit-exam-btn" class="btn btn-success ${
        action === 'take' ? '' : 'hidden'
      }">Submit Exam</button>
    </div>
  `;

  renderExam(root, exam, action);
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam} exam
 * @param {'view' | 'take'} view
 */
function renderExam(root, exam, action = 'view') {
  const questionBox = root.querySelector('#exam-questions');

  removeChildren(questionBox);

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const points = exam.points[i];

    const elem = document.createElement('div');
    elem.setAttribute('class', 'card question');

    elem.innerHTML = /*html*/ `
        <div class="card-title">
          <h2>${question.question_name}</h2>

          <h3>points: ${points}</h3>
        </div>

        <div class="card-body">
          <textarea id="description" disabled></textarea>
          <textarea id="code" class="${
            action === 'take' ? '' : 'hidden'
          }" rows="8" placeholder="Code goes here"></textarea>
        </div>
      `;

    questionBox.appendChild(elem);

    const descriptionBox = elem.querySelector('#description');
    descriptionBox.value = question.question_description;
    descriptionBox.setAttribute(
      'style',
      `height: ${descriptionBox.scrollHeight}px`
    );
  }

  if (action === 'take') {
    root.querySelector('#submit-exam-btn').addEventListener('click', () => {
      submitExam(questionBox, exam);
    });
  }
}

/**
 * @param {HTMLDivElement} questionBox
 * @param {Exam} exam
 */
async function submitExam(questionBox, exam) {
  try {
    let submitExamObject = {
      exam,
      student_id: getUser().id,
      responses: [],
    };

    for (const elem of questionBox.querySelectorAll('.question')) {
      const code = elem.querySelector('#code').value || '';

      if (!code) {
        throw 'Missing Code';
      }

      submitExamObject.responses.push(code);
    }

    console.log({
      submitExamObject: JSON.stringify(submitExamObject),
    });

    try {
      const res = await postRequest('addGrade', submitExamObject);

      console.log(res);

      if (res.success) {
        alertModal('Successfully Submitted Exam');
        window.scrollTo(0, 0);
      }
    } catch (error) {
      alertModal('Submit Exam Error', error);
    }
  } catch (error) {
    alertModal('Submit Exam Error', error);
  }
}
