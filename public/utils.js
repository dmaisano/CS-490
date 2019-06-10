import { isDev, URLS } from './urls.js';

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
    functionName,
    description,
    difficulty,
    topic,
    testCases
  ) {
    this.id = id;
    this.question_name = question_name;
    this.functionName = functionName;
    this.description = description;
    this.difficulty = difficulty;
    this.topic = topic;
    this.testCases = testCases; // 2D string array
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

  renderQuestions(questions, document.querySelector('#question-box'), option);
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
  }
}
