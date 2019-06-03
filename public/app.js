import { LoginHandler } from './login/login.js';

function AppRouter() {
  const AppRoot = document.querySelector('body #root');

  const url = location.hash.slice(1).toLowerCase() || '/';
  const resource = url.split('/')[1] || null; // ie. "/#/instructor/create-exam"

  if (url.includes('/login')) {
    LoginHandler(AppRoot);
  } else {
    console.log('Defaulting to Login Page');
    LoginHandler(AppRoot);
  }

  // console.log({
  //   hash: window.location.hash,
  // });
}

(function() {
  // set the initial fragment identifier
  window.location = '#/';

  // Listen on hash change:
  window.addEventListener('hashchange', AppRouter);

  // Listen on page load:
  window.addEventListener('load', AppRouter);

  // initialize the router
  AppRouter();
})();
