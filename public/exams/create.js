import { getQuestion, postRequest, renderBank } from '../utils.js';
import { alertModal, questionInfo } from '../modal/modal.js';

/** @type {Question[]} */
let questions;

/**
 * @param {HTMLDivElement} root
 */
export async function CreateExamHandler(root) {
  root.innerHTML = CREATE_EXAM_PAGE();

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

  // get the questions
  // postRequest('questions').then(res => {
  //   questions = res;
  //   renderBank(questions, page, 'assign');

  //   const questionElems = page.querySelectorAll('#question-box .question');

  //   for (const questionElem of questionElems) {
  //     const question = getQuestion(questions, questionElem);

  //     questionElem.querySelector('.btn').addEventListener('click', () => {
  //       assignQuestion(questionElem, question);
  //     });
  //   }

  //   page.querySelector('#create-exam-btn').addEventListener('click', () => {
  //     createExam(questions);
  //   });
  // });
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
        <label>Exam Name</label>
        <input
          type="text"
          id="exam-name"
          placeholder="Enter exam name"
          required
        />
      </div>

      <h2 class="title">Exam Questions</h2>

      <button id="create-exam-btn" class="btn btn-success">Create Exam</button>

      <div id="exam-box">
        <div id="placeholder">
          <input type="text" value="No Questions" disabled />
        </div>
      </div>
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
      style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
      class="btn btn-info"
      >
        ?
      </button>
      <button
      type="button"
      style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
      class="btn btn-danger"
      >
        X
      </button>
    `;

    questionBox.appendChild(elem);

    elem.querySelector('.btn-info').addEventListener('click', () => {
      questionInfo(question);
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
  // questionElem.classList.add('');
  questionElem.setAttribute('data-assigned', 'true');

  // remove the element from the exam box and show the original element
  elem.querySelector('.btn').addEventListener('click', () => {
    elem.parentNode.removeChild(elem);
    questionElem.classList.remove('hidden');

    // remove placeholder if exists in question bank
    const placeholderElem = questionElem.parentNode.querySelector(
      '#placeholder'
    );

    if (placeholderElem) {
      placeholderElem.parentNode.removeChild(placeholderElem);
    }

    // add placeholder if no questions in exam box
    if (examBox.querySelectorAll('.question').length < 1) {
      examBox.appendChild(createPlaceholder());
    }
  });
}

/**
 * @param {Question[]} questions
 */
// function createExam(questions) {
//   try {
//     let question_ids = [];
//     let points = [];

//     const exam_name =
//       document.querySelector('.split .new-exam #exam-name').value || '';

//     if (!exam_name) {
//       throw 'Missing exam name';
//     }

//     const questionElems = document.querySelectorAll(
//       '.split .new-exam #exam-box .question'
//     );

//     if (questionElems.length < 1) {
//       throw 'No Questions Added';
//     }

//     for (const elem of questionElems) {
//       question_ids.push(parseInt(elem.getAttribute('data-question-id')));

//       let questionPoints = elem.querySelector('input:nth-child(2)').value || '';

//       if (!questionPoints) {
//         throw 'Missing Points';
//       }

//       questionPoints = Number(questionPoints);

//       if (!Number.isInteger(questionPoints)) {
//         throw 'Points must be int';
//       } else {
//         points.push(questionPoints);
//       }
//     }

//     const sumPoints = points.reduce((num, total) => (total += num));

//     if (sumPoints != 100) {
//       throw 'Exam must be out of 100 points';
//     }

//     const createExamObject = {
//       exam_name,
//       questions,
//       points,
//     };

//     console.log({
//       createExamObject: JSON.stringify(createExamObject),
//     });

//     try {
//       const res = postRequest('addExam', createExamObject);

//       if (res.success) {
//         alertModal('', 'Successfully Created Exam');
//       }
//     } catch (error) {
//       alertModal('Create Exam Error', error);
//     }
//   } catch (error) {
//     alertModal('', error);
//   }
// }
