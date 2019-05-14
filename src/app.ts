import { LoginHandler } from './login/login';

const routes = {
  '/': LoginHandler,
};

const AppRoot: HTMLDivElement = document.querySelector('body #root');

(function() {
  const routeHandler = routes[getRoute()];
  routeHandler(AppRoot);
})();

function getRoute(): string {
  return window.location.pathname;
}
