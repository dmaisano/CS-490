import { LoginHandler } from './login/login';

export const routes = {
  '/': LoginHandler,
};

export function getRoute(): string {
  return window.location.pathname;
}

export function routeHandler(
  AppRoot: HTMLDivElement = document.querySelector('body #root')
): void {
  // extract the function based
  const routeHandler = routes[getRoute()];
  routeHandler(AppRoot);
}
