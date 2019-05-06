import { postObj } from '../scripts/fetch.js';
import {
  closeModal,
  openModal,
  renderQuestionBank,
  renderTopics,
} from '../scripts/questions.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';

window.addTestCase = addTestCase;
window.removeTestCase = removeTestCase;
window.toggleConstraint = toggleConstraint;
window.addToBank = addToBank;
window.questionInfo = questionInfo;
window.closeModal = closeModal;

let questionBank = [];

(function() {
  redirect('instructor').then(res => {
    if (res === true) {
      if (document.querySelector('.split')) {
        document.querySelector('.split').classList.remove('hidden');
      } else {
        document.querySelector('.container').classList.remove('hidden');
      }
    } else {
      window.location.href = '../login';
    }
  });

  getQuestions();

  renderTopics();
})();

/**
 * get the questions from the DB
 */
function getQuestions() {
  postObj(urls.getQuestions, {})
    .then(res => res.json())
    .then(res => {
      questionBank = res;
    })
    .then(() => {
      renderQuestionBank(
        document.querySelector('.question-bank'),
        questionBank
      );
    });
}

function toggleConstraint(index = null) {
  if (index === null) return;

  const elem = document.querySelector(`.constraints .item:nth-child(${index})`);

  const checked = elem.getAttribute('data-checked');

  // toggle the checked state
  if (checked === 'false') {
    elem.setAttribute('data-checked', 'true');
    elem.querySelector('i').classList.remove('fa-square');
    elem.querySelector('i').classList.add('fa-check-square');
  } else {
    elem.setAttribute('data-checked', 'false');
    elem.querySelector('i').classList.remove('fa-check-square');
    elem.querySelector('i').classList.add('fa-square');
  }
}

/**
 * Add a test case element
 */
function addTestCase() {
  const testCases = document.querySelector('.new-question .test-cases');
  const numTestCases = testCases.querySelectorAll('.test-case').length;

  const id = `test-case-${numTestCases + 1}`;

  // cannot add more than 6 test cases
  if (numTestCases === 6) return;

  const elem = document.createElement('div');
  elem.setAttribute('class', 'test-case');
  elem.setAttribute('id', id);

  const markUp = `
    <input type="text" placeholder="Args" required />
    <input type="text" placeholder="Output" required />
    <button type="button" class="btn btn-danger" onclick="removeTestCase('${id}')">
      <i class="fas fa-times"></i>
    </button>
  `;

  elem.innerHTML = markUp;
  testCases.appendChild(elem);
}

/**
 * Remove a test case element
 * @param {string} id
 */
function removeTestCase(id = '') {
  if (id === '') return;

  const testCase = document.querySelector(`.new-question .test-cases > #${id}`);

  testCase.parentNode.removeChild(testCase);
}

/**
 * Adds the newly created question to the question bank
 */
function addToBank() {
  const elem = document.querySelector('.new-question > .card > .card-body');

  const question_name = elem.querySelector('#question-name').value || '';
  const function_name = elem.querySelector('#function-name').value || '';
  const question_description = elem.querySelector('#description').value || '';

  const difficulty = elem.querySelector('#difficulty').selectedOptions.length
    ? elem.querySelector('#difficulty').selectedOptions[0].value
    : '';

  const topic = elem.querySelector('#topics').selectedOptions.length
    ? elem.querySelector('#topics').selectedOptions[0].value
    : '';

  const question_constraints = [];
  for (const constraint of elem.querySelectorAll('.constraints > .item')) {
    const checked = constraint.getAttribute('data-checked') === 'true';

    if (checked) {
      question_constraints.push(constraint.getAttribute('value'));
    }
  }

  const test_cases = [];
  for (let testCase of elem.querySelectorAll('.test-cases > .test-case')) {
    const args = testCase.querySelector('input:nth-child(1)').value || '';
    const output = testCase.querySelector('input:nth-child(2)').value || '';

    if (args === '' || output === '') {
      alert('Missing Test Case!');
      return;
    }

    test_cases.push({
      args,
      output,
    });
  }

  let question = {
    question_name,
    function_name,
    question_description,
    difficulty,
    topic,
    question_constraints,
    test_cases,
  };

  // check if any fields are missing
  if (
    !question_name ||
    !function_name ||
    !question_description ||
    !difficulty ||
    !topic ||
    test_cases.length < 2
  ) {
    alert('Missing Field!');
    return;
  }

  question = {
    question_name,
    function_name,
    question_description,
    difficulty,
    topic,
    question_constraints,
    test_cases,
  };

  postObj(urls.createQuestion, question)
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        alert('Successfully Added Question!');

        // get new questions
        getQuestions();

        // clear the form
        // clearQuestionForm();
      }
    });
}

function clearQuestionForm() {
  const elem = document.querySelector('.new-question > .card > .card-body');

  elem.querySelector('#question-name').value = '';
  elem.querySelector('#function-name').value = '';
  elem.querySelector('#description').value = '';

  elem.querySelector('#difficulty').selectedIndex = 0;
  elem.querySelector('#topics').selectedIndex = 0;

  for (
    let i = 1;
    i <= elem.querySelectorAll('.constraints > .item').length;
    i++
  ) {
    const constraint = elem.querySelector(
      `.constraints > .item:nth-child(${i})`
    );

    const checked = constraint.getAttribute('data-checked') === 'true';

    if (checked) {
      toggleConstraint(i);
    }
  }

  for (const testCase of elem.querySelectorAll('.test-cases > .test-case')) {
    testCase.querySelector('input:nth-child(1)').value = '';
    testCase.querySelector('input:nth-child(2)').value = '';
  }
}

function questionInfo(index = null) {
  if (index === null) return;

  console.log(index);

  openModal(questionBank[index]);
}
