import { getUser } from './utils.js';

/**
 * determine if user is instructor or student
 * if student tries to access instructor pages, redirect them
 * else redirect to login
 * @param {string} type
 */
export function redirect(type = '') {
  const user = getUser();

  if (user) {
    if (type === 'login') {
      window.location.href = `../${user.type}`;
    } else if (type === 'instructor' && user.type !== 'instructor') {
      window.location.href = `../${user.type}`;
    } else if (type === 'instructor' && user.type === 'instructor') {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(true);
    }
  } else {
    // window.location.href = '../login';
    return Promise.resolve(false);
  }
}
