import { HomeHandler } from './home/home.js';
import { QuestionsHandler } from './questions/questions.js';
import { LoginHandler } from './login/login.js';
import { navigateUrl } from './utils.js';

export function AppRouter() {
  const AppRoot = document.querySelector('body #root');

  const url = location.hash.slice(1).toLowerCase() || '/#/login';

  if (url.includes('/login')) {
    LoginHandler(AppRoot);
  } else if (url.includes('/home')) {
    HomeHandler(AppRoot);
  } else if (url.includes('/questions/create')) {
    QuestionsHandler(AppRoot);
  } else {
    LoginHandler(AppRoot);
  }
}

(function() {
  // listen on hash change
  window.addEventListener('hashchange', AppRouter);

  // listen on page load
  // window.addEventListener('load', AppRouter);

  // redirect to login if hash is not specified
  if (!window.location.hash) {
    navigateUrl('#/login');
  }

  // initialize the router
  AppRouter();
})();
