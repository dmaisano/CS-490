import { LoginHandler } from './login/login.js';

const AppRoot = document.querySelector('body #root');

function AppRouter(AppRoot = document.querySelector('body #root')) {
  switch (window.location.pathname) {
    case '/':
      LoginHandler(AppRoot);
      break;

    case '/login':
      LoginHandler(AppRoot);
      break;

    default:
      break;
  }
}

(function() {
  // initialize the router
  AppRouter(AppRoot);
})();
