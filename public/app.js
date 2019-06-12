import { CreateExamHandler } from './exams/create.js';
import { ExamHandler } from './exams/exam.js';
import { GradeHandler } from './grades/view.js';
import { HomeHandler } from './home/home.js';
import { LoginHandler } from './login/login.js';
import { CreateQuestionHandler } from './questions/create.js';
import { navigateUrl } from './utils.js';

export function AppRouter() {
  const AppRoot = document.querySelector('body #root');

  const url = location.hash.slice(2).toLowerCase() || 'login';

  /** @type {Function} */
  let routerFunc;

  switch (url) {
    case 'login':
      routerFunc = LoginHandler;
      break;

    case 'home':
      routerFunc = HomeHandler;
      break;

    case 'question/create':
      routerFunc = CreateQuestionHandler;
      break;

    case 'exam/create':
      routerFunc = CreateExamHandler;
      break;

    case 'exam/view':
      routerFunc = ExamHandler;
      break;

    case 'exam/take':
      routerFunc = ExamHandler;
      break;

    case 'grade/view':
      routerFunc = GradeHandler;
      break;

    default:
      routerFunc = LoginHandler;
      break;
  }

  // call the appropriate page handler
  routerFunc(AppRoot);
}

(function() {
  // listen on hash change
  window.addEventListener('hashchange', AppRouter);

  // listen on page load
  // window.addEventListener('load', AppRouter);

  // redirect to login if hash is not specified
  if (!window.location.hash) {
    navigateUrl('#/login');
  } else {
    // initialize the router
    AppRouter();
  }
})();
