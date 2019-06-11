import { isDev, URLS } from './urls.js';
import { throws } from 'assert';
import { questionInfo } from './modal/modal.js';

/**
 * sends a post request
 * @param {string} urlKey key used to access the url-endpoint based on the current environment
 * @param {object} data
 * @returns {Promise}
 */
export function postRequest(urlKey, data = {}) {
  // php server running on localhost
  let postUrl = 'http://localhost:3000';

  if (!isDev) {
    postUrl = 'https://web.njit.edu/~bm424/490/middle/grader.php';
  }

  data.url = URLS[urlKey];

  return fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .catch(err => {
      console.error(`fetch error`);
      console.error(err);
    });
}

/**
 * @param {HTMLElement} elem
 * @returns {void}
 */
export function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

/**
 * navigate to the given hashUrl
 * @param {string} hashUrl
 */
export function navigateUrl(hashUrl = '') {
  if (hashUrl === '') {
    hashUrl = '#/login';
  }

  window.location = hashUrl;
}

export class User {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

/**
 * @returns {User|null}
 */
export function getUser() {
  return JSON.parse(localStorage.getItem('user')) || null;
}

export class Question {
  constructor(
    id,
    question_name,
    function_name,
    question_description,
    difficulty,
    topic,
    constraints,
    test_cases
  ) {
    this.id = id;
    this.question_name = question_name;
    this.function_name = function_name;
    this.question_description = question_description;
    this.difficulty = difficulty;
    this.topic = topic;
    this.constraints = constraints;
    this.test_cases = test_cases; // 2D string array
  }
}

/**
 * @param {Question[]} questions
 * @param {HTMLDivElement} questionElem
 * @returns {Question|null}
 */
export function getQuestion(questions, questionElem) {
  const id = parseInt(questionElem.getAttribute('data-question-id'));

  for (const question of questions) {
    if (question.id === id) {
      return question;
    }
  }

  return null;
}

/**
 * @param {Question[]} questions
 * @param {HTMLDivElement} page
 * @param {'assign' | 'info'} option
 * @param {Function} clickFunction
 */
export function renderBank(questions, page, option = 'info') {
  const questionBank = page.querySelector('#question-bank');

  // remove any existing children in the question bank
  removeChildren(questionBank);

  questionBank.innerHTML = /*html*/ `
      <h1 class="title">Question Bank</h1>

      <div id="filter-box">
        <input
          type="text"
          id="question_name"
          placeholder="Question Name"
        />

        <div class="custom-select">
          <select id="topics">
            <option value="">Topic</option>
            <option value="Dict">Dict</option>
            <option value="Functions">Functions</option>
            <option value="If">If</option>
            <option value="Lists">Lists</option>
            <option value="Loops">Loops</option>
            <option value="Math">Math</option>
            <option value="Strings">Strings</option>
          </select>

          <div>▼</div>
        </div>

        <div class="custom-select">
          <select id="difficulty">
            <option value="">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <div>▼</div>
        </div>

        <button type="button" class="btn btn-warning">
          Reset
        </button>
      </div>

      <div class="grid">
        <div class="question-bank-header">
          <h3>Question Name</h3>
          <h3>Topic</h3>
          <h3>Difficulty</h3>
          <button class="btn invisible">X</button>
        </div>

        <div id="question-box"></div>
      </div>
    `;

  renderQuestions(questions, page.querySelector('#question-box'), option);

  const filterBox = page.querySelector('#filter-box');

  // reset button
  filterBox.querySelector('.btn-warning').addEventListener('click', () => {
    resetBank(page);
  });

  let filterOptions = {
    question_name: '',
    topic: '',
    difficulty: '',
  };

  filterBox.querySelector('#question_name').addEventListener('keyup', event => {
    filterOptions.question_name = event.target.value.toLowerCase();
    filterQuestionBank(filterOptions, page);
  });

  filterBox.querySelector('#topics').addEventListener('change', event => {
    filterOptions.topic = event.target.value;
    filterQuestionBank(filterOptions, page);
  });

  filterBox.querySelector('#difficulty').addEventListener('change', event => {
    filterOptions.difficulty = event.target.value;
    filterQuestionBank(filterOptions, page);
  });
}

/**
 * render the list of questions
 * @param {Question[]} questions
 * @param {HTMLDivElement} questionBox
 * @param {'assign' | 'info'} option
 */
export function renderQuestions(questions, questionBox, option = 'info') {
  // no questions
  if (questions.length < 1) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.innerHTML = /*html*/ `
      <input
        style="grid-column: span 3;"
        type="text"
        value="No Questions"
        disabled
      />
  `;
    questionBox.appendChild(elem);
    return;
  }

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');

    if (question.id) {
      elem.setAttribute('data-question-id', question.id); // index of the question
    }

    elem.innerHTML = /*html*/ `
      <input type="text" value="${question.question_name}" disabled />
      <input type="text" value="${question.topic}" disabled />
      <input type="text" value="${question.difficulty}" disabled />
      <button
      type="button"
      style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
      class="btn ${option === 'assign' ? 'btn-success' : 'btn-info'}"
      >
        ${option === 'assign' ? '+' : '?'}
      </button>
    `;

    questionBox.appendChild(elem);

    if (option === 'info') {
      elem.querySelector('.btn-info').addEventListener('click', () => {
        questionInfo(question);
      });
    }
  }
}

/**
 * @param {Object} filterOptions
 * @param {HTMLDivElement} page
 */
function filterQuestionBank(filterOptions, page) {
  console.log({
    filterOptions,
  });

  resetBank(page);

  for (const elem of page.querySelectorAll('#question-box .question')) {
    const question_name = elem
      .querySelector('input:nth-child(1)')
      .value.toLowerCase();
    const topic = elem.querySelector('input:nth-child(2)').value;
    const difficulty = elem.querySelector('input:nth-child(3)').value;

    if (
      filterOptions.question_name &&
      !question_name.includes(filterOptions.question_name)
    ) {
      elem.classList.add('hidden');
    }

    if (filterOptions.topic && topic !== filterOptions.topic) {
      elem.classList.add('hidden');
    }

    if (filterOptions.difficulty && difficulty !== filterOptions.difficulty) {
      elem.classList.add('hidden');
    }
  }
}

/**
 * @param {HTMLDivElement} page
 */
function resetBank(page) {
  for (const elem of page.querySelectorAll('#question-box .question')) {
    elem.classList.remove('hidden');
  }
}
