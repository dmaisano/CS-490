import { alertModal } from '../modal/modal.js';
import {
  getUser,
  navigateUrl,
  postRequest,
  removeChildren,
  User,
} from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function GradeHandler(root) {
  const user = getUser();

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
      if (getUser().type !== 'instructor' && !grade.finalized) continue;

      const elem = document.createElement('button');
      elem.setAttribute('class', 'btn btn-primary');

      elem.innerHTML = grade.exam.exam_name;

      elem.addEventListener('click', () => {
        EXAM_PAGE(root, grade);
      });

      links.appendChild(elem);
    }

    links.querySelectorAll('btn');

    if (links.querySelectorAll('.btn').length < 1) {
      const elem = document.createElement('button');
      elem.setAttribute('class', 'btn btn-primary');
      elem.setAttribute('disabled', '');

      elem.innerHTML = 'No Grades';

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
      }">Publish</button>
    </div>
  `;

  renderGrade(root, grade);

  if (getUser().type === 'instructor') {
    root.querySelector('#submit-exam-btn').addEventListener('click', () => {
      updateGrade(root, grade);
    });
  }
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

    const hasFor = question.constraints.includes('for');

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
            <div class="item">
              <h3>Function Name</h3>
              <input id="name" type="text">
            </div>
            <div class="item">
              <h3>For Loop</h3>
              <input id="for" type="text">
            </div>
            <div class="item">
              <h3>Return Statement</h3>
              <input id="return" type="text">
            </div>
            <div class="item">
              <h3>Test Cases</h3>
              <input id="test_case" type="text">
            </div>
          </div>
        </div>
      `;

    questionBox.appendChild(elem);

    const creditBox = elem.querySelector('.question-credit');

    class CreditItem {
      /**
       * @param {'name' | 'for' | 'return' | 'test_case'} type
       */
      constructor(type) {
        this.elem = creditBox.querySelector(`#${type}`);
        this.value = credit[type];
      }
    }

    const credit_obj = {
      name: new CreditItem('name'),
      for: new CreditItem('for'),
      return: new CreditItem('return'),
      test_case: new CreditItem('test_case'),
    };

    if (credit_obj['for'].value === undefined) {
      credit_obj.for.elem.parentNode.classList.add('hidden');
    }

    for (const key of Object.keys(credit_obj)) {
      const item = credit_obj[key];
      const elem = item.elem;

      if (getUser().type !== 'instructor') {
        elem.setAttribute('disabled', '');
      }

      elem.value = item.value;
    }

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
 * @param {HTMLDivElement} root
 * @param {Grade} grade
 */
async function updateGrade(root, grade) {
  try {
    let credit = [];
    let instructor_comments = [];

    for (let i = 0; i < root.querySelectorAll('.card').length; i++) {
      const question = grade.exam.questions[i];
      const card = root.querySelectorAll('.card')[i];

      let points = grade.exam.points[i];

      let sumPoints = {};

      instructor_comments.push(card.querySelector('#comments').value || '');

      for (const inputElem of card.querySelectorAll(
        '.question-credit .item input'
      )) {
        const id = inputElem.getAttribute('id');

        // skip for
        if (id === 'for' && question.constraints.length < 1) continue;

        const value = Number(inputElem.value);

        if (isNaN(value)) {
          throw 'Points must be int';
        } else {
          sumPoints[id] = value;
        }
      }

      const totalPoints = Object.values(sumPoints).reduce(
        (total, num) => (total += num)
      );

      credit.push(sumPoints);

      if (totalPoints > points) {
        throw `${
          question.question_name
        } cannot be worth more than ${points} points!`;
      }
    }

    const updateGradeObject = {
      user: getUser(),
      student_id: grade.student_id,
      exam: grade.exam,
      instructor_comments,
      credit,
    };

    try {
      const res = await postRequest('updateGrade', updateGradeObject);

      console.log(res);
    } catch (error) {
      window.scrollTo(0, 0);
      alertModal('Update Grade Error', error);
    }
  } catch (error) {
    window.scrollTo(0, 0);
    alertModal(error);
  }
}
