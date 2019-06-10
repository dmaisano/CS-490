import { Question } from './questions/questions.js';
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
  constructor(id, pass, type) {
    this.id = id;
    this.pass = pass;
    this.type = type;
  }
}

/**
 * @returns {User|null}
 */
export function getUser() {
  return JSON.parse(localStorage.getItem('user')) || null;
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
