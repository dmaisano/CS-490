import { alertModal, questionInfo } from '../modal/modal.js';
import { filterQuestionBank, postRequest, resetBank, Exam } from '../utils.js';

/**
 * @param {HTMLDivElement} root
 */
export async function CreateExamHandler(root) {
  let questions;

  root.innerHTML = CREATE_EXAM_PAGE();

  const page = root.querySelector('.split');

  try {
    questions = await postRequest('questions');

    renderQuestions(questions, page.querySelector('#question-box'));
  } catch (error) {
    console.error({
      CREATE_EXAM_PAGE: error,
    });
    return;
  }

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

  // create exam
  page.querySelector('#create-exam-btn').addEventListener('click', () => {
    createExam(questions);
  });
}

/**
 * @returns {string}
 */
export function CREATE_EXAM_PAGE() {
  return /*html*/ `
  <div class="split">
    <div id="question-bank">
      <h1 class="title">Question Bank</h1>

      <div id="filter-box">
        <input type="text" id="question_name" placeholder="Question Name" />

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
          <button class="btn invisible">X</button>
        </div>

        <div id="question-box"></div>
      </div>
    </div>

    <div class="new-exam">
      <h1 class="title">Create Exam</h1>

      <div class="form-group exam-name">
        <input
          type="text"
          id="exam-name"
          placeholder="Exam Name"
          required
        />

        <button id="create-exam-btn" class="btn btn-success">Create Exam</button>
      </div>

      <h2 class="title">Exam Questions</h2>


      <div id="exam-box"></div>
    </div>
  </div>
`;
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
      <button
      type="button"
      class="btn btn-success"
      >
        +
      </button>
    `;

    questionBox.appendChild(elem);

    elem.querySelector('.btn-info').addEventListener('click', () => {
      questionInfo(question);
    });

    elem.querySelector('.btn-success').addEventListener('click', () => {
      assignQuestion(elem, question);
    });
  }
}

/**
 * @param {HTMLDivElement} questionElem
 * @param {Question} question
 */
function assignQuestion(questionElem, question) {
  const examBox = document.querySelector('#exam-box');

  const elem = document.createElement('div');
  elem.setAttribute('class', 'question');
  elem.setAttribute('data-question-id', question.id);

  elem.innerHTML = /*html*/ `
    <input type="text" value="${question.question_name}" disabled/>
    <input type="text" placeholder="Question Points"/>
    <button type="button" class="btn btn-danger">X</button>
  `;

  examBox.appendChild(elem);

  // hide the original question
  questionElem.setAttribute('data-assigned', 'true');

  // remove the element from the exam box and show the original element
  elem.querySelector('.btn').addEventListener('click', () => {
    elem.parentNode.removeChild(elem);
    questionElem.removeAttribute('data-assigned');

    // remove placeholder if exists in question bank
    const placeholderElem = questionElem.parentNode.querySelector(
      '#placeholder'
    );

    if (placeholderElem) {
      placeholderElem.parentNode.removeChild(placeholderElem);
    }
  });
}

/**
 * @param {Question[]} questions
 */
async function createExam(questions) {
  try {
    let assigned_questions = [];
    let points = [];

    const exam_name =
      document.querySelector('.split .new-exam #exam-name').value || '';

    if (!exam_name) {
      throw 'Missing exam name';
    }

    const questionElems = document.querySelectorAll(
      '.split .new-exam #exam-box .question'
    );

    if (questionElems.length < 1) {
      throw 'No Questions Added';
    }

    for (const elem of questionElems) {
      const id = parseInt(elem.getAttribute('data-question-id'));

      for (const question of questions) {
        if (question.id === id) {
          assigned_questions.push(question);
          break;
        }
      }

      assigned_questions.push();

      let questionPoints = elem.querySelector('input:nth-child(2)').value || '';

      if (!questionPoints) {
        throw 'Missing Points';
      }

      questionPoints = Number(questionPoints);

      if (!Number.isInteger(questionPoints)) {
        throw 'Points must be int';
      } else {
        points.push(questionPoints);
      }
    }

    const sumPoints = points.reduce((num, total) => (total += num));

    if (sumPoints != 100) {
      throw 'Exam must be out of 100 points';
    }

    // const createExamObject = {
    //   exam_name,
    //   questions: assigned_questions,
    //   points,
    // };

    const createExamObject = new Exam(
      '',
      exam_name,
      '',
      assigned_questions,
      [],
      [],
      points,
      [],
      0,
      1
    );

    console.log(createExamObject);

    try {
      const res = await postRequest('addExam', createExamObject);

      console.log(res);

      if (res.success) {
        alertModal('Successfully Created Exam');
      }
    } catch (error) {
      alertModal('Create Exam Error', error);
    }
  } catch (error) {
    alertModal('Create Exam Error', error);
  }
}
