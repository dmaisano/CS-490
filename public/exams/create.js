import { autosize } from '../scripts/autosize.js';
import { postObj } from '../scripts/fetch.js';
import { renderQuestionBank, renderTopics } from '../scripts/questions.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { convertQuestion } from '../scripts/utils.js';

window.addExamQuestion = addExamQuestion;
window.removeExamQuestion = removeExamQuestion;
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

  // autosize();

  // get the questions from the DB
  postObj(urls.getQuestions, {})
    .then(res => res.json())
    .then(res => {
      questionBank = res;
    })
    .then(() => {
      renderQuestionBank(
        document.querySelector('.card .question-bank'),
        questionBank,
        'add'
      );
    });

  renderTopics();
})();

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

  // create new question elem
  const elem = document.createElement('div');
  elem.setAttribute('class', 'question');
  elem.setAttribute('id', id);
  elem.setAttribute('data-index', index);

  elem.innerHTML = `
    <input type="text" value="${question.question_name}" disabled />
    <input type="text" value="${question.topic}" disabled />
    <input type="text" value="${question.difficulty}" disabled />
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

  function setDescription() {
    const description = modal.querySelector('#description');
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
  const modal = document.querySelector('.modal');

  modal.classList.add('hidden');
}
