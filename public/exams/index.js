import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';

window.selectExam = selectExam;

let exams = [];
let selectedExam = {};
let user = {};

// fetch urls
const urls = {
  getExams: `'https://web.njit.edu/~jps78/middle/sendingCurl.php'`,
};

(function() {
  redirect('instructor').then(() => {
    user = JSON.parse(localStorage.getItem('user'));

    getExams(user);
  });
})();

/**
 * get the exams from the DB
 */
function getExams() {
  // get the list of exams
  return postObj(urls.getExams, {})
    .then(res => res.json())
    .then(res => {
      exams = res;
      console.log(res);
    })
    .then(() => {
      renderExams();
    });
}

/**
 * render the exam links
 */
function renderExams() {
  const examLinks = document.querySelector('.exam-links');

  if (exams.length < 1) {
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('disabled', '');
    link.innerHTML = `No Exams Added`;

    examLinks.appendChild(link);
    return;
  }

  for (const exam of exams) {
    const id = exam.exam_name.split(' ').join('_');
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('id', id);
    link.setAttribute('onclick', `selectExam('${id}')`);

    link.innerHTML = `${exam.exam_name}`;

    examLinks.appendChild(link);
  }
}

/**
 * select the exam to view
 * @param {string} id
 */
function selectExam(id) {
  const exam_name = id.split('_').join(' ');

  for (const exam of exams) {
    if (exam.exam_name === exam_name) {
      selectedExam = exam;
      console.log(exam);
      break;
    }

    alert(`Unable to select exam ${exam_name}`);
    return;
  }

  // hide the links and render the exam contents
  const examLinks = document.querySelector('.exam-links');
  examLinks.setAttribute('style', 'display: none;');
}
