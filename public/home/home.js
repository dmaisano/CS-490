import { getUser, navigateUrl } from '../utils.js';

// get the user
const user = getUser();

/**
 * Student / Instructor Page
 * @param {HTMLDivElement} root
 */
export function HomeHandler(root) {
  if (!user) {
    navigateUrl('#/login');
  }

  console.log({
    user,
  });

  switch (user.type) {
    case 'student':
      root.innerHTML = STUDENT_HOME_PAGE;
      break;

    case 'instructor':
      root.innerHTML = INSTRUCTOR_HOME_PAGE;
      break;

    default:
      navigateUrl('#/login');
      break;
  }
}

const STUDENT_HOME_PAGE = /*html*/ `
  <div class="home">
    <div class="title">
      <h1>Student Home</h1>
      <h2>User: ${user.id.toUpperCase()}</h2>
    </div>

    <div class="links">
      <a href="/#/student/grades" class="btn btn-primary">View Grades</a>
      <a href="/#/student/exam" class="btn btn-primary">Take Exam</a>
    </div>
  </div>
`;

const INSTRUCTOR_HOME_PAGE = /*html*/ `
  <div class="home">
    <div class="title">
      <h1>Instructor Home</h1>
      <h2>User: ${user.id.toUpperCase()}</h2>
    </div>

    <div class="links">
      <a href="/#/instructor/grades" class="btn btn-primary">View Student Grades</a>
      <a href="/#/instructor/exams" class="btn btn-primary">View Exams</a>
      <a href="/#/exam/create" class="btn btn-primary">Create Exam</a>
      <a href="/#/questions/create" class="btn btn-primary">Create Questions</a>
    </div>
  </div>
`;
