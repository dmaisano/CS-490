import { getUser, navigateUrl, User } from '../utils.js';

/**
 * Student / Instructor Page
 * @param {HTMLDivElement} root
 */
export function HomeHandler(root) {
  // get the user
  const user = getUser();

  if (!user) {
    navigateUrl('#/login');
  }

  switch (user.type) {
    case 'student':
      root.innerHTML = STUDENT_HOME_PAGE(user);
      break;

    case 'instructor':
      root.innerHTML = INSTRUCTOR_HOME_PAGE(user);
      break;

    default:
      navigateUrl('#/login');
      break;
  }
}

/**
 * @param {User} user
 * @returns {string}
 */
function STUDENT_HOME_PAGE(user) {
  return /*html*/ `
  <div class="home">
    <div class="title">
      <h1>Student Home</h1>
      <h2>User: ${user.id.toUpperCase()}</h2>
    </div>

    <div class="links">
      <a href="./#/student/grades/select" class="btn btn-primary">View Grades</a>
      <a href="./#/student/exam/select" class="btn btn-primary">Take Exam</a>
    </div>
  </div>
`;
}

/**
 * @param {User} user
 * @returns {string}
 */
function INSTRUCTOR_HOME_PAGE(user) {
  return /*html*/ `
  <div class="home">
    <div class="title">
      <h1>Instructor Home</h1>
      <h2>User: ${user.id.toUpperCase()}</h2>
    </div>

    <div class="links">
      <a href="./#/instructor/grades/select" class="btn btn-primary">View Student Grades</a>
      <a href="./#/exams/view" class="btn btn-primary">View Exams</a>
      <a href="./#/exams/create" class="btn btn-primary">Create Exam</a>
      <a href="./#/questions/create" class="btn btn-primary">Create Questions</a>
    </div>
  </div>
`;
}
