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
  });

  renderTopics();
}

/**
 * @param {HTMLDivElement} questionElem
 * @param {Question} question
 * @param {number} len
 */
function assignQuestion(questionElem, question, len) {
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

  // determine if there are any questions visible in the question bank
  render_exam_bank_placeholer(questionElem);

  // remove the element from the exam box and show the original element
  elem.querySelector('.btn').addEventListener('click', () => {
    elem.parentNode.removeChild(elem);
    questionElem.classList.remove('hidden');

    // add placeholder if no questions in exam box
    if (examBox.querySelectorAll('.question').length < 1) {
      examBox.appendChild(createPlaceholder());

      // remove any existing placeholers
      render_exam_bank_placeholer();
    }
  });
}

/**
 * either adds or removes the placeholder for the exam bank
 * @param {HTMLDivElement} questionElem
 */
function render_exam_bank_placeholer(questionElem) {
  const questionElems = questionElem.parentNode.querySelectorAll('.question');

  const placeholderElem =
    questionElem.parentNode.querySelector('#placeholder') || null;

  if (placeholderElem) {
    questionElem.parentNode.removeChild(placeholderElem);
  }

  for (const elem of questionElems) {
    if (!elem.classList.contains('hidden')) {
      // question is visible, remove placeholder if exists
      if (placeholderElem) {
        questionElem.parentNode.removeChild(placeholderElem);
        break;
      }
    }
  }

  // no questions visible, render placeholder
  questionElem.parentNode.appendChild(createPlaceholder());
}

function createExam() {}

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
