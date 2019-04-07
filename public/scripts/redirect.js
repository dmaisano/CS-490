/**
 * determine if user is instructor or student
 * else redirect to login
 * @param {string} type
 */
export function redirect() {
  let user = sessionStorage.getItem('user');

  if (user) {
    const type = JSON.parse(user).type;

    window.location.href = `/${type}`;
  } else {
    window.location.href = '/login';
  }
}
