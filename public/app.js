import { LoginHandler } from './login/login.js';

const AppRoot = document.querySelector('body #root');

function AppRouter(AppRoot = document.querySelector('body #root')) {
  let routeHandler;

  switch (window.location.pathname) {
    case '/':
      routeHandler = LoginHandler;
      break;

    case '/login':
      routeHandler = LoginHandler;
      break;

    default:
      break;
  }

  routeHandler(AppRoot);
}

(function() {
  // initialize the router
  AppRouter(AppRoot);
})();
