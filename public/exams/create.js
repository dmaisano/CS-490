import { removeChildren, postRequest } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function CreateExamHandler(root) {
  root.innerHTML = CREATE_EXAM_PAGE();

  // const page = root.querySelector('.questions');
  // QuestionBank.renderBank(page);
}

/**
 * @returns {string}
 */
function CREATE_EXAM_PAGE() {
  return /*html*/ `
    <div></div>
  `;
}
