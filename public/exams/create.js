import { postObj } from '../scripts/fetch.js';
import {
  closeModal,
  openModal,
  renderQuestionBank,
  renderTopics,
} from '../scripts/questions.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { convertQuestion } from '../scripts/utils.js';

window.addExamQuestion = addExamQuestion;
window.removeExamQuestion = removeExamQuestion;
window.filterQuestions = filterQuestions;
window.questionInfo = questionInfo;
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
    <button type="button" class="btn" onclick="questionInfo(${index})"><i class="fas fa-info-circle"></i></button>
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

function questionInfo(index = null) {
  if (index === null) return;

  console.log(index);

  openModal(questionBank[index]);
}

function filterQuestions(reset = false) {
  if (reset) {
    return renderQuestionBank(
      document.querySelector('.question-bank'),
      questionBank
    );
  }

  const filterBox = document.querySelector('#filter-box');

  const question_name = filterBox.querySelector('#question_name').value || '';

  const difficulty = filterBox.querySelector('#difficulty').selectedOptions
    .length
    ? filterBox.querySelector('#difficulty').selectedOptions[0].value
    : '';

  const topic = filterBox.querySelector('#topics').selectedOptions.length
    ? filterBox.querySelector('#topics').selectedOptions[0].value
    : '';

  renderQuestionBank(
    document.querySelector('.question-bank'),
    questionBank,
    '',
    {
      question_name,
      difficulty,
      topic,
    }
  );
}
