import { HomeHandler } from './home/home.js';
import { LoginHandler } from './login/login.js';
import { navigateUrl } from './utils.js';

/**
 * @returns {void}
 */
export function AppRouter() {
  const AppRoot = document.querySelector('body #root');

  const url = location.hash.slice(1).toLowerCase() || '/';
  const resource = url.split('/')[1] || null;

  if (url.includes('/login')) {
    LoginHandler(AppRoot);
  } else if (url.includes('/home')) {
    HomeHandler(AppRoot);
  } else {
    LoginHandler(AppRoot);
  }
}

(function() {
  // Listen on hash change
  window.addEventListener('hashchange', AppRouter);

  // Listen on page load
  window.addEventListener('load', AppRouter);

  // redirect to login if hash is not specified
  if (!window.location.hash) {
    navigateUrl('#/login');
  }

  // initialize the router
  AppRouter();
})();
