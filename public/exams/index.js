import { renderExamLinks, selectExam } from '../scripts/exams.js';
import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';
import { getUser } from '../scripts/utils.js';

window.viewExam = viewExam;

let exams = [];
let selectedExam = {};
let user = {};

(function() {
  redirect('instructor').then(() => {
    user = getUser();

    getExams(user);
  });
})();

/**
 * get the exams from the DB
 */
function getExams(user = null) {
  if (user === null) return;

  // get the list of exams
  return postObj(urls.getExams, user)
    .then((res) => res.json())
    .then((res) => {
      exams = res;
    })
    .then(() => {
      renderExamLinks(exams, document.querySelector('.exam-links .container'));
    });
}

/**
 * Choose the exam to render / view
 * @param {number} index
 */
function viewExam(index = null) {
  if (index === null) return;

  selectExam(exams, index);
}
