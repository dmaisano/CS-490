import { postObj } from '../scripts/fetch.js';
import { urls } from '../scripts/urls.js';
import { convertQuestion } from '../scripts/utils.js';

/**
 * render the question bank
 * @param {Element} bank DOM element containing the question bank
 * @param {Array} questions array of question objects
 * @param {string} type general purpose flag
 */
export function renderQuestionBank(
  bank = null,
  questions = [],
  type = '',
  filterOptions = null
) {
  if (!bank) {
    console.error('renderQuestionBank: missing bank element');
  } else if (questions === [] || questions.length < 1) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.innerHTML = `
      <input
        type="text"
        style="grid-column: span 3"
        value="No Questions"
        disabled
      />
    `;
    bank.appendChild(elem);
    return;
  }

  // Remove all existing / placeholder questions
  for (const question of bank.querySelectorAll('.question')) {
    question.parentNode.removeChild(question);
  }

  // populate the question bank
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    if (filterOptions) {
      const { question_name, difficulty, topics } = filterOptions;

      console.log({
        question_name,
        difficulty,
        topics,
      });
    }

    // convert the question name to a valid ID
    const id = convertQuestion(question.question_name, 'id');

    // create new question elem
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', id);
    elem.setAttribute('data-index', i);

    let markUp = '';

    switch (type) {
      case 'add':
        markUp = `
            <input type="text" value="${question.question_name}" disabled />
            <input type="text" value="${question.topic}" disabled />
            <input type="text" value="${question.difficulty}" disabled />
            <button type="button" class="btn btn-success" onclick="addExamQuestion(${i})">
              <i class="fas fa-plus"></i>
            </button>
          `;
        break;

      default:
        markUp = `
            <input type="text" value="${question.question_name}" disabled />
            <input type="text" value="${question.topic}" disabled />
            <input type="text" value="${question.difficulty}" disabled />
            <button type="button" class="btn" onclick="questionInfo(${i})">
              <i class="fas fa-info-circle"></i>
            </button>
          `;
        break;
    }

    elem.innerHTML = markUp;
    bank.appendChild(elem);
  }
}

export function filterQuestionBank(
  filter = {},
  filterBox = document.querySelector('#filter-box'),
  questionBnk = []
) {
  return 'owo';
}

/**
 * render the list of topics
 */
export function renderTopics() {
  postObj(urls.getTopics, {})
    .then(res => res.json())
    .then(res => {
      const elems = document.querySelectorAll('#topics');

      for (const el of elems) {
        for (const topic of res) {
          const option = document.createElement('option');
          option.text = topic;
          el.add(option, null);
        }
      }
    });
}

/**
 *
 * @param {string} id
 * @param {*} index
 */
export function openModal(question = null) {
  if (question === null || question === {}) return;

  const modal = document.querySelector('.modal');
  modal.classList.remove('hidden');

  // set the function name, topic, and difficulty
  modal.querySelector('#function-name > input').value =
    question.function_name || 'No Function Name';

  modal.querySelector('#topic').value = question.topic || 'No Topic';

  modal.querySelector('#difficulty').value =
    question.difficulty || 'No Difficulty';

  function setDescription() {
    const description = modal.querySelector('#description > textarea');
    description.value = question.question_description;
  }

  function renderConstraints() {
    for (let i = 0; i < 4; i++) {
      const constraint = modal.querySelector(
        `.constraints .item:nth-child(${i + 1})`
      );

      const constraints = question.question_constraints;

      function toggleCheck() {
        constraint.querySelector('i').classList.remove('fa-square');
        constraint.querySelector('i').classList.add('fa-check-square');
      }

      switch (i) {
        case 0:
          if (constraints.includes('if')) {
            toggleCheck();
          }
          break;

        case 1:
          if (constraints.includes('print')) {
            toggleCheck();
          }
          break;

        case 2:
          if (constraints.includes('for')) {
            toggleCheck();
          }
          break;

        case 3:
          if (constraints.includes('while')) {
            toggleCheck();
          }
          break;

        default:
          break;
      }
    }
  }

  function renderTestCases() {
    const testCaseElems = modal.querySelector('.test-cases');

    const existingCases = testCaseElems.querySelectorAll('.test-case');

    // remove existing test cases
    if (existingCases) {
      for (const testCase of existingCases) {
        testCase.parentNode.removeChild(testCase);
      }
    }

    for (const testCase of question.test_cases) {
      const elem = document.createElement('div');
      elem.setAttribute('class', 'test-case form-group');

      elem.innerHTML = `
        <input type="text" value="${testCase.args}" readonly />
        <input type="text" value="${testCase.output}" readonly />
      `;

      testCaseElems.appendChild(elem);
    }
  }

  setDescription();
  renderConstraints();
  renderTestCases();
}

export function closeModal() {
  document.querySelector('.modal').classList.add('hidden');
}
