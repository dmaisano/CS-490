import { alertModal, questionInfo } from '../modal/modal.js';
import { filterQuestionBank, postRequest, resetBank } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function CreateQuestionHandler(root) {
  root.innerHTML = CREATE_QUESTION_PAGE();

  const page = root.querySelector('.split');

  try {
    const questions = await postRequest('questions');

    renderQuestions(questions, page.querySelector('#question-box'));
  } catch (error) {
    console.error({
      CREATE_QUESTION_PAGE: error,
    });
    return;
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

  // filtering
  let filterOptions = {
    question_name: '',
    topic: '',
    difficulty: '',
  };

  const filterBox = page.querySelector('#filter-box');

  filterBox.querySelector('#question_name').addEventListener('keyup', event => {
    filterOptions.question_name = event.target.value;
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

  filterBox.querySelector('.btn-warning').addEventListener('click', () => {
    resetBank(page);
  });
}

function CREATE_QUESTION_PAGE() {
  return /*html*/ `
  <div class="split">
    <div class="new-question">
      <h1 class="title">Create Question</h1>

      <div class="form">
        <div class="input">
          <div class="form-group">
            <label>Question Name</label>
            <input type="text" id="question-name" placeholder="Enter question name" required />
          </div>

          <div class="form-group">
            <label>Function Name</label>
            <input type="text" id="function-name" placeholder="Enter function name" required />
          </div>
        </div>

        <div class="select">
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

          <!-- constraints go here -->
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="description" rows="5" placeholder="Enter question description"></textarea>
        </div>

        <div class="constraints">
          <div class="constraint" data-value="if" data-checked="false">
            If Statement
          </div>
          <div class="constraint" data-value="print" data-checked="false">
            Print Statement
          </div>
          <div class="constraint" data-value="for" data-checked="false">
            For Loop
          </div>
          <div class="constraint" data-value="while" data-checked="false">
            While Loop
          </div>
        </div>

        <h2 class="title">Test Cases</h2>

        <div id="test-cases">
          <div class="test-case">
            <input type="text" placeholder="Args" required />
            <input type="text" placeholder="Output" required />
            <button type="button" class="btn" disabled>
              X
            </button>
          </div>
          <div class="test-case">
            <input type="text" placeholder="Args" required />
            <input type="text" placeholder="Output" required />
            <button type="button" class="btn" disabled>
              X
            </button>
          </div>
        </div>

        <div class="form-buttons">
          <button type="button" id="add-test-case" class="btn btn-success">Add Test Case</button>
          <button type="button" id="create-question" class="btn btn-success">Create Question</button>
        </div>
      </div>
    </div>

    <div id="question-bank">
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
    </div>
  </div>
`;
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
 * @param {HTMLDivElement} page
 */
async function createQuestion(page) {
  try {
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
    for (const elem of questionForm.querySelectorAll(
      '#test-cases .test-case'
    )) {
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

    if (!question_name) throw 'Missing Question Name';
    else if (!function_name) throw 'Missing Function Name';
    else if (!topic) throw 'Missing Question Topic';
    else if (!difficulty) throw 'Missing Question Difficulty';
    else if (!question_description) throw 'Missing Question Description';

    console.log({
      addQuestionObject: JSON.stringify(question),
    });

    try {
      const res = await postRequest('questionsAdd', question);

      if (!res.success) {
        alertModal('Failed to Create Question');
      } else {
        // reload the page
        CreateQuestionHandler(document.querySelector('#root'));
      }
    } catch (error) {
      alertModal('Create Question Error', error);
    }
  } catch (error) {
    alertModal('Create Question Error', error);
  }
}

/**
 * render the list of questions
 * @param {Question[]} questions
 * @param {HTMLDivElement} questionBox
 */
export function renderQuestions(questions, questionBox) {
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
      class="btn btn-info"
      >
        ?
      </button>
    `;

    questionBox.appendChild(elem);

    elem.querySelector('.btn-info').addEventListener('click', () => {
      questionInfo(question);
    });
  }
}
