import { navigateUrl, postRequest, User } from '../utils.js';

const MOCK_EXAM = {
  id: 1,
  exam_name: 'Sample 1',
  questions: [
    {
      id: 3,
      question_name: 'Double It',
      function_name: 'doubleIt',
      question_description:
        'Write a function named doubleIt that takes an int as its arg and returns 2 * the num.',
      difficulty: 'Easy',
      topic: 'Math',
      test_cases: [['2', '4'], ['6', '8']],
    },
    {
      id: 4,
      question_name: 'Return String',
      function_name: 'returnString',
      question_description:
        'Write a function called returnString that takes a string as its arg and returns the string',
      difficulty: 'Easy',
      topic: 'Strings',
      test_cases: [['"foo"', '"foo"'], ['"bar"', '"bar"']],
    },
  ],
};

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function TakeExamHandler(root) {
  root.innerHTML = TAKE_EXAM_PAGE();

  const page = root.querySelector('.exam');

  renderExamQuestions(page, MOCK_EXAM.questions);
}

/**
 * @returns {string}
 */
function TAKE_EXAM_PAGE() {
  return /*html*/ `
  <div class="exam">
    <div id="exam-questions">
      <div class="card question">
        <div class="card-title">
          <h2>Double It</h2>

          <div>25 points</div>
        </div>

        <div class="card-body">
          <textarea rows="5" disabled>Write a function named double It</textarea>
          <textarea rows="8" placeholder="Enter Code"></textarea>
        </div>
      </div>
      <div class="card question">
        <div class="card-title">
          <h2>Double It</h2>

          <div>25 points</div>
        </div>

        <div class="card-body">
          <textarea rows="5" disabled>Write a function named double It</textarea>
          <textarea rows="8" placeholder="Enter Code"></textarea>
        </div>
      </div>
    </div>

    <button id="submit-exam" class="btn btn-success">Submit Exam</button>
  </div>
`;
}

/**
 * @param {HTMLDivElement} page
 * @param {Question[]} questions
 */
function renderExamQuestions(page, questions) {
  // const card = document.createElement();
}
