import { removeChildren, postRequest } from '../utils.js';

let questions;

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function QuestionsHandler(root) {
  postRequest('questions').then(res => {
    questions = res;
  });

  root.innerHTML = QUESTIONS_PAGE();

  const page = root.querySelector('.questions');
  QuestionBank.renderBank(page);

  // render the questions
  renderQuestions();

  // render topics
  renderTopics();
}

/**
 * @returns {string}
 */
const QUESTIONS_PAGE = function() {
  return /*html*/ `
  <div class="questions">
    <div class="new-question">
      <h1 class="title">Add Question</h1>
    </div>

    <div id="question-bank"></div>
  </div>
`;
};

export class QuestionBank {
  constructor() {
    /** @type {Promise} */
    this.questions = postRequest('questions');

    /** @type {Promise} */
    this.topics = postRequest('topics');
  }

  /**
   * @param {HTMLDivElement} questionBank
   */
  static renderBank(page) {
    this.questionBank = page.querySelector('#question-bank');

    // remove any existing children in the question bank
    removeChildren(this.questionBank);

    this.questionBank.innerHTML = /*html*/ `
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
          <select>
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
          <button class="btn" style="visibility: hidden;">X</button>
        </div>

        <div id="question-box"></div>
      </div>
    `;
  }
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
 * render the list of questions
 * @param {'add' | 'info'} option
 */
export function renderQuestions(option = 'info') {
  postRequest('questions').then(res => {
    const questionBox = document.querySelector('#question-box');

    /**
     * @type {Question[]}
     */
    const questions = res;

    // no questions
    if (questions.length < 1) {
      const elem = document.createElement('div');
      elem.setAttribute('class', 'question');
      elem.setAttribute('style', 'grid-column: span 3;');
      elem.innerHTML = /*html*/ `
        <input
          type="text"
          value="No Questions"
          disabled
        />
    `;
      questionBox.appendChild(elem);
      return;
    }

    // remove existing questions if any exist
    removeChildren(questionBox);

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      console.log(question);

      const elem = document.createElement('div');
      elem.setAttribute('class', 'question');
      elem.setAttribute('data-index', i); // index of the question

      elem.innerHTML = /*html*/ `
        <input type="text" value="${question.question_name}" disabled />
        <input type="text" value="${question.topic}" disabled />
        <input type="text" value="${question.difficulty}" disabled />
        <button type="button" class="btn ${
          option === 'add' ? 'btn-success' : 'btn-info'
        }">
        ${option === 'add' ? '+' : '?'}
        </button>
      `;

      questionBox.appendChild(elem);
    }
  });
}

/**
 * render the list of topics
 */
export function renderTopics() {
  postRequest('topics').then(topics => {
    /** @type {HTMLSelectElement} */
    for (const elem of document.querySelectorAll('#topics')) {
      for (const topic of topics) {
        /**
         * @type {HTMLOptionElement}
         */
        const option = document.createElement('option');
        option.text = topic.topic;
        elem.add(option);
      }
    }
  });
}
