import { postObj } from '../scripts/fetch.js';
import { renderQuestionBank, renderTopics } from '../scripts/questions.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { convertQuestion } from '../scripts/utils.js';

window.addExamQuestion = addExamQuestion;
window.removeExamQuestion = removeExamQuestion;
window.filterQuestions = filterQuestions;
window.openModal = openModal;
window.closeModal = closeModal;

let questionBank = [];

(function() {
  redirect('instructor').then(res => {
    if (res === true) {
      document.querySelector('.split').classList.remove('hidden');
    } else {
      window.location.href = '../login';
    }
  });

  // get the questions from the DB
  postObj(urls.getQuestions, {})
    .then(res => res.json())
    .then(res => {
      res.forEach(question => {
        questionBank.push(question);
      });
    })
    .then(() => {
      renderQuestionBank(
        document.querySelector('.question-bank'),
        questionBank,
        'add'
      );
    });

  renderTopics();
})();

function filterQuestions(reset = false) {
  const questionBank = document.querySelector('.question-bank');

  /**
   * returns an array of question IDs which have already been added to the exam
   */
  function getAssignedQuestions() {
    let res = [];

    for (const question of document.querySelectorAll(
      '.exam-bank > .question'
    )) {
      res.push(question.getAttribute('id'));
    }

    return res;
  }

  /**
   * resets the question bank
   * will hide questions currently assigned to the exam
   */
  function reset() {
    const assignedQuestions = getAssignedQuestions();

    for (const question of questionBank.querySelectorAll('.question')) {
      const id = question.getAttribute('id');

      // set question to visible if not assigned to the exam
      if (!assignedQuestions.includes(id)) {
        question.classList.remove('hidden');
      }
    }
  }

  if (reset) {
    reset();
    return;
  }

  const filterBox = document.querySelector('#filter-box');

  const question_name = filterBox.querySelector('#question_name').value || '';
  const topic =
    filterBox.querySelector('#topicsss').selectedOptions[0].value || '';
  const difficulty =
    filterBox.querySelector('#difficulty').selectedOptions[0].value || '';

  console.log({
    question_name,
    topics,
  });

  // render the question bank with the filterOptions
  // renderQuestionBank(
  //   document.querySelector('.question-bank'),
  //   questionBank,
  //   '',
  //   {
  //     question_name,
  //     difficulty,
  //     topics,
  //   }
  // );
}

function addExamQuestion(index = null) {
  if (index === null) return;

  const examBank = document.querySelector('.card .exam-bank');

  // check if placeholder exists and remove it
  const placeholder = examBank.querySelector('#placeholder');
  if (placeholder) {
    placeholder.parentNode.removeChild(placeholder);
  }

  const question = questionBank[index];
  const id = convertQuestion(question.question_name, 'id');

  // hide selected question
  document
    .querySelector(`.card .question-bank > .question:nth-child(${index + 1})`)
    .classList.add('hidden');

  // create new question elem
  const elem = document.createElement('div');
  elem.setAttribute('class', 'question');
  elem.setAttribute('id', id);
  elem.setAttribute('data-index', index);

  elem.innerHTML = `
    <input type="text" value="${question.question_name}" disabled />
    <input type="text" value="" placeholder="Points" required />
    <button type="button" class="btn" onclick="openModal('${id}', ${index})"><i class="fas fa-info-circle"></i></button>
    <button type="button" class="btn btn-danger" onclick="removeExamQuestion('${id}', ${index})"><i class="fas fa-times"></i></button>
  `;

  examBank.appendChild(elem);
}

function removeExamQuestion(id = '', index = null) {
  if (!id || index === null) return;

  const examBank = document.querySelector('.card .exam-bank');
  const question = examBank.querySelector(`#${id}`);
  // const questions = examBank.querySelectorAll('.question');

  // add back to question bank
  document
    .querySelector(`.card .question-bank > .question:nth-child(${index + 1})`)
    .classList.remove('hidden');

  // remove the selected element / question
  examBank.removeChild(question);

  // check if exam bank is empty
  if (examBank.querySelectorAll('.question').length < 1) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', 'placeholder');
    elem.innerHTML = `
     <input
        style="grid-column: span 5;"
        type="text"
        value="No Questions Added"
        disabled
      />
    `;
    examBank.appendChild(elem);
  }
}

function openModal(id = '', index = null) {
  if (!id || index === null) return;
  const modal = document.querySelector('.modal');
  modal.classList.remove('hidden');

  const question = questionBank[index];

  // set the function name, topic, and difficulty
  modal.querySelector('#function-name > input').value =
    question.function_name || 'No Function Name';

  modal.querySelector('#topic').value = question.topic || 'No Topic';

  modal.querySelector('#difficulty').value =
    question.difficulty || 'No Difficulty';

  function setDescription() {
    const description = modal.querySelector('#description > textarea');
    description.value = question.question_description;
    description.style.height = `${description.scrollHeight}px`;
  }

  function renderConstraints() {}

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

  console.log(question);

  setDescription();
  renderConstraints();
  renderTestCases();
}

function closeModal() {
  document.querySelector('.modal').classList.add('hidden');
}
