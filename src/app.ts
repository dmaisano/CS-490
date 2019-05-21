import { routeHandler } from './routes';

const AppRoot: HTMLDivElement = document.querySelector('body #root');

(function() {
  // initialize the router
  routeHandler(AppRoot);
})();
