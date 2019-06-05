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

    for (const elem of page.querySelectorAll('#question-box .question')) {
      const question = getQuestion(questions, elem);

      elem.querySelector('.btn').addEventListener('click', () => {
        console.log(question);
      });
    }
  });

  renderTopics();
}

function assignQuestion() {}
