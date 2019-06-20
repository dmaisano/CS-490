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
      console.log(grade);

      if (getUser().type !== 'instructor' && grade.finalized != '1') continue;

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
        getUser().type == 'instructor' ? '' : 'hidden'
      }">Publish</button>
    </div>
  `;

  renderGrade(root, grade);

  if (getUser().type == 'instructor') {
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
              <h3>Type</h3>
              <h4>Earned</h4>
              <h4>Total</h4>
            </div>
            <div class="item" id="name">
              <h3>Function Name</h3>
              <input id="name-earned" type="text">
              <input id="name-total" type="text" disabled>
            </div>
            <div class="item" id="for">
              <h3>For Loop</h3>
              <input id="for-earned" type="text">
              <input id="for-total" type="text" disabled>
            </div>
            <div class="item" id="return">
              <h3>Return Statement</h3>
              <input id="return-earned" type="text">
              <input id="return-total" type="text" disabled>
            </div>
          </div>

          <div class="test-case-credit">
            <div class="item">
              <h3>Type</h3>
              <h4>Earned</h4>
              <h4>Total</h4>
              <h4>Input</h4>
              <h4>Output</h4>
            </div>
          </div>
        </div>
      `;

    questionBox.appendChild(elem);

    const creditBox = elem.querySelector('.question-credit');

    const nameElem = creditBox.querySelector('.item:nth-child(2)');
    const forElem = creditBox.querySelector('.item:nth-child(3)');
    const returnElem = creditBox.querySelector('.item:nth-child(4)');

    if (!hasFor) {
      forElem.classList.add('hidden');
    } else {
      forElem.querySelector(':nth-child(2)').value = credit.for.earned;
      forElem.querySelector(':nth-child(3)').value = credit.for.total;
    }

    nameElem.querySelector(':nth-child(2)').value = credit.name.earned;
    nameElem.querySelector(':nth-child(3)').value = credit.name.total;

    returnElem.querySelector(':nth-child(2)').value = credit.return.earned;
    returnElem.querySelector(':nth-child(3)').value = credit.return.total;

    const test_case_credit_box = elem.querySelector('.test-case-credit');
    for (let i = 0; i < credit.test_cases.length; i++) {
      const current_test_case = credit.test_cases[i];

      const elem = document.createElement('div');
      elem.setAttribute('class', 'item');

      elem.innerHTML = /*html*/ `
        <h3>Test Case ${i + 1}</h3>
        <input id="earned" type="text">
        <input id="total" type="text" disabled>
        <input style="text-align: end;" id="input" type="text" disabled>
        <input style="text-align: end;" id="output" type="text" disabled>
      `;

      test_case_credit_box.appendChild(elem);

      elem.querySelector(':nth-child(2)').value = current_test_case.earned;
      elem.querySelector(':nth-child(3)').value = current_test_case.total;
      elem.querySelector(':nth-child(4)').value = current_test_case.input;
      elem.querySelector(':nth-child(5)').value = current_test_case.output;
    }

    if (getUser().type !== 'instructor') {
      for (const elem of [
        ...creditBox.querySelectorAll('input'),
        ...test_case_credit_box.querySelectorAll('input'),
      ]) {
        elem.setAttribute('disabled', '');
      }
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

    if (getUser().type == 'student') {
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
    let sumPoints = 0;
    let credit = grade.credit;
    let instructor_comments = [];

    for (let i = 0; i < root.querySelectorAll('.card').length; i++) {
      const question = grade.exam.questions[i];
      const card = root.querySelectorAll('.card')[i];

      instructor_comments.push(card.querySelector('#comments').value || '');

      for (const elem of card.querySelectorAll('.question-credit .item')) {
        const id = elem.getAttribute('id');

        if (id == undefined) {
          continue;
        }

        const earned = elem.querySelector(':nth-child(2)');

        if (id == 'for' && !question.constraints.includes('for')) {
          continue;
        }

        let value = Number(earned.value);

        if (isNaN(value)) {
          throw 'Points must be numeric';
        } else if (value > credit[i][id].total) {
          throw 'Earned cannot be more than total';
        } else {
          sumPoints += value;
          credit[i][id].earned = value;
        }
      }

      for (
        let j = 0;
        j < card.querySelectorAll('.test-case-credit .item').length;
        j++
      ) {
        const elem = card.querySelectorAll('.test-case-credit .item')[j];

        if (j == 0) {
          continue;
        }

        const index = j - 1;

        const earned = elem.querySelector(':nth-child(2)');

        let value = Number(earned.value);

        if (isNaN(value)) {
          throw 'Points must be numeric';
        } else if (value > credit[i].test_cases[index].total) {
          throw 'Earned cannot be more than total';
        } else {
          sumPoints += value;
          credit[i].test_cases[index].earned = value;
        }
      }

      if (sumPoints > 100) {
        const diff = Math.floor(Math.abs(sumPoints - 100));

        if (diff > 5) {
          throw 'Exam cannot be worth more than 100 points';
        }
      }
    }

    const updateGradeObject = {
      user: getUser(),
      student_id: grade.student_id,
      exam: grade.exam,
      instructor_comments,
      credit,
    };

    console.log({
      updateGradeObject: JSON.stringify(updateGradeObject),
    });

    try {
      const res = await postRequest('updateGrade', updateGradeObject);

      console.log(res);

      window.scrollTo(0, 0);
      alertModal('Successfully Published Grade');
    } catch (error) {
      window.scrollTo(0, 0);
      alertModal('Update Grade Error', error);
    }
  } catch (error) {
    console.log(error);
    window.scrollTo(0, 0);
    alertModal(error);
  }
}
