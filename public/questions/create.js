import { postRequest, renderBank, getQuestion, navigateUrl } from '../utils.js';
import { CREATE_QUESTION_PAGE } from './create.page.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function CreateQuestionHandler(root) {
  root.innerHTML = CREATE_QUESTION_PAGE();

  const page = root.querySelector('.split');

  try {
    const questions = await postRequest('questions');

    renderBank(questions, page, 'info');

    if (questions.length) {
      for (const elem of page.querySelectorAll('#question-box .question')) {
        const question = getQuestion('questions', elem);

        elem.querySelector('.btn').addEventListener('click', () => {
          // placeholder for info modal
          console.log(question);
        });
      }
    }

    console.log(questions);
  } catch (error) {
    console.error({
      CREATE_QUESTION_PAGE: error,
    });

    // show modal alert and navigate the user back to the home page
    navigateUrl('#/home');
  }

  // toggle the constraints
  for (const constraint of page.querySelectorAll('.constraints .constraint')) {
    constraint.addEventListener('click', () => {
      switch (constraint.getAttribute('data-checked')) {
        case 'false':
          constraint.setAttribute('data-checked', 'true');
          break;

        default:
          constraint.setAttribute('data-checked', 'false');
          break;
      }
    });
  }

  // add event listener for adding test cases
  page.querySelector('.btn#add-test-case').addEventListener('click', () => {
    addTestCase();
  });

  // create question
  page.querySelector('.btn#create-question').addEventListener('click', () => {
    createQuestion(page);
  });
}

export function filterQuestionBank() {}

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
async function createQuestion(page) {
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

  const test_cases = [];
  const constraints = [];

  for (const elem of questionForm.querySelectorAll(
    '.constraints .constraint'
  )) {
    if (elem.getAttribute('data-checked') === 'true') {
      constraints.push(elem.getAttribute('data-value'));
    }
  }

  // get the test cases
  for (const elem of questionForm.querySelectorAll('#test-cases .test-case')) {
    const arg = elem.querySelector('input:nth-child(1)').value || '';
    const output = elem.querySelector('input:nth-child(2)').value || '';

    test_cases.push([arg, output]);
  }

  const question = {
    question_name,
    function_name,
    question_description,
    topic,
    difficulty,
    constraints,
    test_cases,
  };

  console.log({
    addQuestionObject: JSON.stringify(question),
  });

  try {
    const res = await postRequest('questionsAdd', question);

    if (!res.success) {
      alert('Failed to add Question');
      return;
    } else {
      // reload the page
      CreateQuestionHandler(document.querySelector('#root'));
    }
  } catch (error) {
    console.error({
      question: error,
    });
  }
}
