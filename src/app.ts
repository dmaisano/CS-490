import { LoginHandler } from './login/login';

const AppRoot: HTMLDivElement = document.querySelector('body #root');

export function AppRouter(
  AppRoot: HTMLDivElement = document.querySelector('body #root')
): void {
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
