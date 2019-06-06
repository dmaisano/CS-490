import { postRequest, getUser, navigateUrl } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function SelectExamHandler(root) {
  root.innerHTML = SELECT_EXAM_PAGE();

  const page = root.querySelector('.exam');

  renderUserExams(page);
}

/**
 * @returns {string}
 */
function SELECT_EXAM_PAGE() {
  return /*html*/ `
  <div class="exam">
    <h2 class="exam-title">Exams</h2>

    <div class="exam-links">
    </div>
  </div>
`;
}

/**
 * @param {HTMLDivElement} page
 */
async function renderUserExams(page) {
  const student = getUser();

  const exams = await postRequest('exams');

  const grades = await postRequest('grades');

  if (grades.length) {
    for (let i = 0; i < grades.length; i++) {
      const grade = grades[i];

      if (grade.student_id === student.id) {
        if (exam.id === exams) {
          // remove the exam
        }
      }
    }
  }

  for (const exam of exams) {
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary');
    btn.innerHTML = exam.exam_name;

    btn.addEventListener('click', () => {
      sessionStorage.setItem('student-exam-take', JSON.stringify(exam));
      navigateUrl('#/student/exam');
    });

    page.querySelector('.exam-links').appendChild(btn);
  }
}
