import { postRequest, removeChildren, renderTopics } from '../utils.js';
import { QUESTIONS_PAGE } from './questions.page.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function QuestionsHandler(root) {
  root.innerHTML = QUESTIONS_PAGE();

  const page = root.querySelector('.split');
  QuestionBank.renderBank(page);

  // render the questions
  renderQuestions();

  // render topics
  renderTopics();

  // add event listener for adding test cases
  document.querySelector('.btn#add-test-case').addEventListener('click', () => {
    addTestCase();
  });

  // add event listener for creating / submitting the quesiton
  document
    .querySelector('.btn#create-question')
    .addEventListener('click', () => {
      createQuestion(page);
    });
}

export class QuestionBank {
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
 * @param {'assign' | 'info'} option
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

    // remove existing questions if any exist
    removeChildren(questionBox);

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      const elem = document.createElement('div');
      elem.setAttribute('class', 'question');
      elem.setAttribute('data-index', i); // index of the question

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

    for (const elem of questionBox.querySelectorAll('.question')) {
      const index = parseInt(elem.getAttribute('data-index'));
      const question = questions[index];

      elem.querySelector('.btn').addEventListener('click', () => {
        console.log(question);
      });
    }
  });
}

export function filterQuestionBank() {
  console.log('owo');
}

function addTestCase() {
  const testCases = document.querySelector('#test-cases');

  // can't add more test cases
  if (document.querySelectorAll('#test-cases .test-case').length >= 5) return;

  const elem = document.createElement('div');
  elem.setAttribute('class', 'test-case');

  elem.innerHTML = /*html*/ `
    <input type="text" placeholder="Args" required />
    <input type="text" placeholder="Output" required />
    <button type="button" class="btn btn-danger">
      X
    </button>
  `;

  testCases.appendChild(elem);

  elem.querySelector('.btn').addEventListener('click', () => {
    elem.parentNode.removeChild(elem);
  });
}

/**
 *
 * @param {HTMLDivElement} page
 */
function createQuestion(page) {
  const questionForm = page.querySelector('.new-question .form');

  const question_name =
    questionForm.querySelector('#question-name').value || '';
  const function_name =
    questionForm.querySelector('#function-name').value || '';
  const question_description =
    questionForm.querySelector('#description').value || '';

  const topic = questionForm.querySelector('#topics').selectedOptions.length
    ? questionForm.querySelector('#topics').selectedOptions[0].value
    : '';

  const difficulty = questionForm.querySelector('#difficulty').selectedOptions
    .length
    ? questionForm.querySelector('#difficulty').selectedOptions[0].value
    : '';

  let test_cases = [];

  for (const elem of questionForm.querySelectorAll('#test-cases .test-case')) {
    const arg = elem.querySelector('input:nth-child(1)').value || '';
    const output = elem.querySelector('input:nth-child(2)').value || '';

    test_cases.push([arg, output]);
  }

  const requestObj = {
    question_name,
    function_name,
    question_description,
    topic,
    difficulty,
    test_cases,
  };

  console.log(requestObj);

  postRequest('questionsAdd', requestObj).then(res => {
    if (!res.success) {
      alert('Failed to add Question');
      return;
    }

    renderQuestions('info');
  });
}
