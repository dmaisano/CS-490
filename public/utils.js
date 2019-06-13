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
 * @param {Object} filterOptions
 * @param {HTMLDivElement} page
 */
export function filterQuestionBank(filterOptions, page) {
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
export function resetBank(page) {
  for (const elem of page.querySelectorAll('#question-box .question')) {
    if (!elem.getAttribute('data-assigned')) {
      elem.classList.remove('hidden');
    }
  }
}

export class Exam {
  /**
   * @param {number} id
   * @param {string} exam_name
   * @param {Question[]} questions
   * @param {number[]} points
   */
  constructor(id = null, exam_name, questions, points = []) {
    this.id = id;
    this.exam_name = exam_name;
    this.questions = questions;
    this.points = points;
  }
}
export class Grade {
  /**
   * @param {number} id
   * @param {string} student_id
   * @param {Exam} exam
   * @param {string[]} responses
   * @param {string[]} instructor_comments
   * @param {Object} credit
   * @param {0 | 1} finalized
   */
  constructor(
    id = null,
    student_id,
    exam,
    responses,
    instructor_comments,
    credit,
    finalized
  ) {
    this.id = id;
    this.student_id = student_id;
    this.exam = exam;
    this.responses = responses;
    this.instructor_comments = instructor_comments;
    this.credit = credit;
    this.finalized = finalized;
  }
}
