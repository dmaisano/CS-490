import {
  getUser,
  navigateUrl,
  postRequest,
  Exam,
  removeChildren,
  User,
} from '../utils.js';
import { alertModal } from '../modal/modal.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function GradeHandler(root) {
  const user = getUser();

  console.log(location.hash);

  if (location.hash !== '#/grade/view') {
    navigateUrl('#/home');
  }

  switch (user.type) {
    case 'instructor':
      SELECT_STUDENT_PAGE(root);
      break;

    case 'student':
      SELECT_EXAM_PAGE(root, getUser());
      break;

    default:
      navigateUrl('#/home');
      break;
  }
}

/**
 * @param {HTMLDivElement} root
 */
async function SELECT_STUDENT_PAGE(root) {
  try {
    const students = await postRequest('students');

    root.innerHTML = /*html*/ `
      <div class="select-exam">
        <div class="card">
          <div class="card-title">
            <h2>Students</h2>
          </div>

          <div class="card-body links"></div>
        </div>
      </div>
    `;

    const links = root.querySelector('.card-body.links');

    for (const student of students) {
      const elem = document.createElement('button');
      elem.setAttribute('class', 'btn btn-primary');

      elem.innerHTML = student.id;

      elem.addEventListener('click', () => {
        SELECT_EXAM_PAGE(root, student);
      });

      links.appendChild(elem);
    }
  } catch (error) {
    alertModal('Get Students Error', error);
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {User} student
 */
async function SELECT_EXAM_PAGE(root, student) {
  try {
    const grades = await postRequest('grades', {
      user: student,
    });

    console.log(grades);

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

    for (const grade of grades) {
      const elem = document.createElement('button');
      elem.setAttribute('class', 'btn btn-primary');

      elem.innerHTML = grade.exam.exam_name;

      elem.addEventListener('click', () => {
        EXAM_PAGE(root, grade);
      });

      links.appendChild(elem);
    }
  } catch (error) {
    alertModal('Failed to Load Exams');
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {Grade} grade
 */
function EXAM_PAGE(root, grade) {
  root.innerHTML = /*html*/ `
    <div class="exam">
      <h2 class="exam-title">Exam: ${grade.exam.exam_name}</h2>

      <div id="exam-questions"></div>

      <button type="button" id="submit-exam-btn" class="btn btn-success ${
        getUser().type === 'instructor' ? '' : 'hidden'
      }">Grade Exam</button>
    </div>
  `;

  console.log(grade);

  renderGrade(root, grade);
}

/**
 * @param {HTMLDivElement} root
 * @param {Grade} grade
 */
function renderGrade(root, grade) {
  const questionBox = root.querySelector('#exam-questions');

  removeChildren(questionBox);

  for (let i = 0; i < grade.exam.questions.length; i++) {
    const question = grade.exam.questions[i];
    const code = grade.responses[i];
    const comments = grade.instructor_comments[i] || '';
    const points = grade.exam.points[i];
    const credit = grade.credit[i];

    const elem = document.createElement('div');
    elem.setAttribute('class', 'card question');

    elem.innerHTML = /*html*/ `
        <div class="card-title">
          <h2>${question.question_name}</h2>

          <h3>points: ${points}</h3>
        </div>

        <div class="card-body">
          <div class="form-group">
            <label>Description</label>
            <textarea id="description" disabled></textarea>
          </div>
          <div class="form-group">
            <label>Code</label>
            <textarea id="code" disabled></textarea>
          </div>
          <div class="form-group">
            <label>Comments</label>
            <textarea id="comments"  placeholder="Instructor Comments" ></textarea>
          </div>

          <div class="question-credit">

          </div>
        </div>
      `;

    questionBox.appendChild(elem);

    // elem.querySelector('#new-points').value = points_earned.toString();

    const descriptionBox = elem.querySelector('#description');
    descriptionBox.value = question.question_description;
    descriptionBox.setAttribute(
      'style',
      `height: ${descriptionBox.scrollHeight}px`
    );

    const commentsBox = elem.querySelector('#comments');
    commentsBox.value = comments || '';
    commentsBox.setAttribute('style', `height: ${commentsBox.scrollHeight}px`);

    if (getUser().type === 'student') {
      commentsBox.setAttribute('disabled', '');
    }

    const codeBox = elem.querySelector('#code');
    codeBox.value = code;

    codeBox.style.height = codeBox.scrollHeight + 'px';
  }
}

/**
 * @param {HTMLDivElement} questionBox
 * @param {Exam} exam
 */
async function finalizeGrade(questionBox, exam) {
  try {
    // let submitExamObject = new Exam(
    //   '',
    //   exam.exam_name,
    //   getUser().id,
    //   exam.questions,
    //   [],
    //   [],
    //   exam.points,
    //   [],
    //   0,
    //   0
    // );

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
    } catch (error) {
      alertModal('Submit Exam Error', error);
    }
  } catch (error) {
    alertModal('Submit Exam Error', error);
  }
}
