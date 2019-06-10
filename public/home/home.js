import { getUser, navigateUrl, User } from '../utils.js';

/**
 * Student / Instructor Page
 * @param {HTMLDivElement} root
 */
export function HomeHandler(root) {
  // get the user
  const user = getUser();

  console.log({
    user,
  });

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

function STUDENT_HOME_PAGE(user) {
  return /*html*/ `
  <div class="home">
    <div class="card">
      <div class="card-title">
        <h1>Student Home</h1>
        <h2>User: ${user.id.toUpperCase()}</h2>
      </div>

      <div class="card-body links">
        <a href="./#/grades" class="btn btn-primary">View Grades</a>
        <a href="./#/exam/take" class="btn btn-primary">Take Exam</a>
      </div>
    </div>
  </div>
`;
}

function INSTRUCTOR_HOME_PAGE(user) {
  return /*html*/ `
  <div class="home">
    <div class="card">
      <div class="card-title">
        <h1>Instructor Home</h1>
        <h2>User: ${user.id.toUpperCase()}</h2>
      </div>

      <div class="card-body links">
        <a href="./#/grades" class="btn btn-primary">View Student Grades</a>
        <a href="./#/exam/view" class="btn btn-primary">View Exams</a>
        <a href="./#/exam/create" class="btn btn-primary">Create Exam</a>
        <a href="./#/Question/create" class="btn btn-primary">Create Questions</a>
      </div>
    </div>
  </div>
`;
}
