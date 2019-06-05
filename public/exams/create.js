import { renderBank } from '../questions/questions.js';
import { getQuestion, postRequest, renderTopics } from '../utils.js';
import { CREATE_EXAM_PAGE } from './create.page.js';

/** @type {Question[]} */
let questions;

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function CreateExamHandler(root) {
  root.innerHTML = CREATE_EXAM_PAGE();

  const page = root.querySelector('.split');

  // get the questions
  postRequest('questions').then(res => {
    questions = res;
    renderBank(questions, page, 'assign');

    const questionElems = page.querySelectorAll('#question-box .question');

    for (const questionElem of questionElems) {
      const question = getQuestion(questions, questionElem);

      questionElem.querySelector('.btn').addEventListener('click', () => {
        assignQuestion(questionElem, question);
      });
    }

    page.querySelector('#create-exam-btn').addEventListener('click', () => {
      createExam(questions);
    });
  });

  renderTopics();
}

/**
 * @param {HTMLDivElement} questionElem
 * @param {Question} question
 */
function assignQuestion(questionElem, question) {
  const examBox = document.querySelector('#exam-box');

  const placeholder = examBox.querySelector('#placeholder') || null;

  // remove the placeholder elem if exists
  if (placeholder) {
    examBox.removeChild(placeholder);
  }

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
  questionElem.classList.add('hidden');

  // all questions are hidden in the bank
  if (
    questionElem.parentNode.querySelectorAll('.question.hidden').length ===
    questionElem.parentNode.querySelectorAll('.question').length
  ) {
    questionElem.parentNode.appendChild(createPlaceholder());
  }

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
 * @param {Question[]}
 */
function createExam() {
  let question_ids = [];
  let points = [];

  const exam_name =
    document.querySelector('.split .new-exam #exam-name').value || '';

  if (!exam_name) {
    alert('Missing exam name');
    return;
  }

  const questionElems = document.querySelectorAll(
    '.split .new-exam #exam-box .question'
  );

  if (questionElems.length < 1) {
    alert('No Questions Added');
    return;
  }

  for (const elem of questionElems) {
    question_ids.push(parseInt(elem.getAttribute('data-question-id')));

    let questionPoints = elem.querySelector('input:nth-child(2)').value || '';

    if (!questionPoints) {
      alert('Missing Points');
    }

    questionPoints = Number(questionPoints);

    if (!Number.isInteger(questionPoints)) {
      alert('Points must be int');
    } else {
      points.push(questionPoints);
    }
  }

  const sumPoints = points.reduce((num, total) => (total += num));

  if (sumPoints != 100) {
    alert('Exam must be out of 100 points');
  }

  const createExamObject = {
    exam_name,
    question_ids,
    points,
  };

  console.log(JSON.stringify(createExamObject));
}

/**
 * @returns {HTMLDivElement}
 */
function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.setAttribute('id', 'placeholder');

  placeholder.innerHTML = /*html*/ `
      <input style="grid-column: span 3;" type="text" value="No Questions" disabled/>
  `;

  return placeholder;
}
