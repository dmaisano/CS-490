import { removeChildren } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function QuestionsHandler(root) {
  root.innerHTML = QUESTIONS_PAGE();

  const page = root.querySelector('.questions');

  const questionBank = new QuestionBank(page);
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
  /**
   * @param {HTMLDivElement} questionBank
   */
  constructor(page) {
    this.questionBank = page.querySelector('#question-bank');

    console.log({
      questions: this.getQuestions(),
    });

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
          <input type="text" value="Question Name" disabled />
          <input type="text" value="Topic" disabled />
          <input type="text" value="Difficulty" disabled />
        </div>

        <div id="question-box"></div>
      </div>
    `;
  }

  getQuestions() {
    return 'owo';
  }
}
