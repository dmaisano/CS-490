import { getUser, navigateUrl } from '../utils.js';

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
    <div class="links">
      <div></div>
    </div>
  </div>
`;

const INSTRUCTOR_HOME_PAGE = /*html*/ `
  <div class="home">
    <div class="links">
      <div></div>
    </div>
  </div>
`;
