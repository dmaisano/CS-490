import { postRequest, getUser, navigateUrl } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export async function SelectGradeHandler(root) {
  root.innerHTML = SELECT_GRADE_PAGE();

  const page = root.querySelector('.exam');

  renderGrades(page);
}

/**
 * @returns {string}
 */
function SELECT_GRADE_PAGE() {
  return /*html*/ `
  <div class="exam">
    <h2 class="exam-title">Grades</h2>

    <div class="student-links"></div>

    <div class="exam-links"></div>
  </div>
`;
}

/**
 * @param {HTMLDivElement} page
 */
async function renderStudents(page) {
  const students = await postRequest('getStudents');

  for (const student of students) {
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary');
    btn.innerHTML = student.id;

    btn.addEventListener('click', () => {
      renderGrades(page, student);
    });

    console.log(page);

    page.querySelector('.student-links').appendChild(btn);
  }
}

/**
 * @param {HTMLDivElement} page
 */
async function renderGrades(page, student = null) {
  let user = getUser();

  const grades = await postRequest('grades');

  if (user.type === 'instructor' && student === null) {
    renderStudents(page);
  } else if (user.type === 'student' || student != null) {
    page.querySelector('.student-links').classList.add('hidden');
    page.querySelector('.exam-links').classList.remove('hidden');

    for (const grade of grades) {
      const btn = document.createElement('button');
      btn.setAttribute('class', 'btn btn-primary');
      btn.innerHTML = grade.exam.exam_name;

      btn.addEventListener('click', () => {
        sessionStorage.setItem('student-grade', JSON.stringify(grade));

        if (user.type === 'instructor') {
          navigateUrl('#/instructor/grade');
        } else {
          navigateUrl('#/student/grade');
        }
      });

      page.querySelector('.exam-links').appendChild(btn);
    }
  }
}
