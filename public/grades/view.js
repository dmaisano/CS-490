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
    const exams = await postRequest('grades', {
      user: student,
    });

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
        EXAM_PAGE(root, exam);
      });

      links.appendChild(elem);
    }
  } catch (error) {
    alertModal('Failed to Load Exams');
  }
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam} exam
 */
function EXAM_PAGE(root, exam) {
  root.innerHTML = /*html*/ `
    <div class="exam">
      <h2 class="exam-title">Exam: ${exam.exam_name}</h2>

      <div id="exam-questions"></div>

      <button type="button" id="submit-exam-btn" class="btn btn-success ${
        getUser().type === 'instructor' ? '' : 'hidden'
      }">Grade Exam</button>
    </div>
  `;

  renderExam(root, exam);
}

/**
 * @param {HTMLDivElement} root
 * @param {Exam} exam
 */
function renderExam(root, exam) {
  const questionBox = root.querySelector('#exam-questions');

  removeChildren(questionBox);

  for (let i = 0; i < exam.questions.length; i++) {
    const question = exam.questions[i];
    const code = exam.responses[i];
    const comments = exam.instructor_comments[i] || '';
    const points = exam.points[i];
    const points_earned = exam.points_earned[i];

    const elem = document.createElement('div');
    elem.setAttribute('class', 'card question');

    elem.innerHTML = /*html*/ `
        <div class="card-title">
          <h2>${question.question_name}</h2>

          ${
            getUser().type === 'instructor'
              ? /*html*/ `
                <div class="view-points">
                  <h3>Points: </h3>
                  <input type="text" id="new-points" value="" style="width: 3.25rem;">
                  <h3>/ ${points}</h3>
                </div>
              `
              : /*html*/ `<h3>points: ${points_earned} / ${points}</h3>`
          }
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
        </div>
      `;

    questionBox.appendChild(elem);

    elem.querySelector('#new-points').value = points_earned.toString();
    elem.querySelector('#description').value = question.question_description;

    const commentsBox = elem.querySelector('#comments');
    commentsBox.value = comments || '';
    commentsBox.setAttribute('style', `height: ${commentsBox.scrollHeight}px`);

    const codeBox = elem.querySelector('#code');
    codeBox.value = code;

    codeBox.style.height = codeBox.scrollHeight + 'px';
  }
}

/**
 * @param {HTMLDivElement} questionBox
 * @param {Exam} exam
 */
async function submitExam(questionBox, exam) {
  try {
    let submitExamObject = new Exam(
      '',
      exam.exam_name,
      getUser().id,
      exam.questions,
      [],
      [],
      exam.points,
      [],
      0,
      0
    );

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
