import { DEV_URLS } from '../urls.js';
import { getUser, navigateUrl, postRequest } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function ExamHandler(root) {
  const user = getUser();

  console.log(user);

  console.log(location.hash);

  root.innerHTML = VIEW_EXAM_PAGE(exam);

  const page = root.querySelector('.exam');
}

/**
 * @returns {string}
 */
function VIEW_EXAM_PAGE(exam) {
  return /*html*/ `
  <div class="exam">
  <h2 class="exam-title"></h2>

    <div id="exam-questions"></div>

    <button id="submit-exam" class="btn btn-success">Submit Exam</button>
  </div>
`;
}
