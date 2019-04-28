import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';
import { urls } from '../scripts/urls.js';

import { renderQuestions, renderTopics } from '../scripts/questions.js';

window.addTestCase = addTestCase;
window.removeTestCase = removeTestCase;
window.addToBank = addToBank;

let questionBank = [];

(function() {
  redirect('instructor');

  autosize();

  // get the questions from the DB
  postObj(urls.getQuestions, {})
    .then(res => res.json())
    .then(res => {
      questionBank = res;
    })
    .then(() => {
      renderQuestions('.card .bank', questionBank);
    });

  renderTopics();
})();

/**
 * add a test case element
 */
function addTestCase() {
  const testCases = document.querySelector('.newQuestion > .test-cases');
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
 * remove a test case element
 * @param {string} id
 */
function removeTestCase(id = '') {
  if (id === '') return;

  const testCase = document.querySelector(
    `.newQuestion > .test-cases > #${id}`
  );

  testCase.parentNode.removeChild(testCase);
}

/**
 * adds the newly created question to the question bank
 */
function addToBank() {
  const question_name =
    document.querySelector('.newQuestion > #questionName').value || '';
  const function_name =
    document.querySelector('.newQuestion > #functionName').value || '';
  const question_description =
    document.querySelector('.newQuestion > #description').value || '';

  const difficulty = document.querySelector(
    '.newQuestion > .custom-select > #difficulty'
  ).selectedOptions.length
    ? document.querySelector('.newQuestion > .custom-select > #difficulty')
        .selectedOptions[0].value
    : '';

  const topic = document.querySelector(
    '.newQuestion > .custom-select > #topics'
  ).selectedOptions.length
    ? document.querySelector('.newQuestion > .custom-select > #topics')
        .selectedOptions[0].value
    : '';

  const question_constraint = document.querySelector(
    '.newQuestion > .custom-select > #constraint'
  ).selectedOptions.length
    ? document.querySelector('.newQuestion > .custom-select > #constraint')
        .selectedOptions[0].value
    : '';

  const test_cases = [];
  const testCaseElems = document.querySelectorAll(
    '.newQuestion > .test-cases > .test-case'
  );

  for (let testCase of testCaseElems) {
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

  const question = {
    question_name,
    function_name,
    question_description,
    difficulty,
    topic,
    question_constraint,
    test_cases,
  };

  postObj(urls.createQuestion, question)
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
}
