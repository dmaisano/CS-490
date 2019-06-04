import { navigateUrl, postRequest, User } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function TakeExamHandler(root) {
  root.innerHTML = TAKE_EXAM_PAGE();

  const page = root.querySelector('.exam');
}

/**
 * @returns {string}
 */
function TAKE_EXAM_PAGE() {
  return /*html*/ `
  <div class="exam">
    <textarea id="code" rows="5" placeholder="Enter code"></textarea>

    <button id="btn" class="btn btn-primary">CLICK ME</button>
  </div>
`;
}
