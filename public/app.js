import { LoginHandler } from './login/login.js';

const AppRoot = document.querySelector('body #root');

function AppRouter(AppRoot = document.querySelector('body #root')) {
  switch (window.location.pathname) {
    default:
      LoginHandler(AppRoot);
      break;
  }
}

(function() {
  // initialize the router
  AppRouter(AppRoot);
})();
