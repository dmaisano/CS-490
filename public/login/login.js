import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';

// reference: https://stackoverflow.com/questions/44590393/es6-modules-undefined-onclick-function-after-import
// tldr; globally exposing the function as per the nature of ES6 modules
window.login = login;

(function() {
  let user = sessionStorage.getItem('user');

  // redirect if logged in
  // if (user) {
  //   redirect(JSON.parse(user));
  // }
})();

document.querySelector('#password').addEventListener('keyup', event => {
  if (event.key !== 'Enter') return;

  login();

  event.preventDefault();
});

function login() {
  const user = document.querySelector('#username').value || '';
  const pass = document.querySelector('#password').value || '';

  const url = 'http://localhost:4200/api/user';

  postObj(url, {
    user,
    pass,
  })
    .then(res => {
      if (res.status !== 200) {
        alert('Failed To Log In');
        return false;
      }

      return res.json();
    })
    .then(user => {
      if (!user) return;

      sessionStorage.setItem('user', JSON.stringify(user));
    });

  fetch('http://localhost:4200/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
      pass,
    }),
  })
    .then(res => {
      if (res.status !== 200) {
        alert('Failed To Log In');
        return false;
      }

      return res.json();
    })
    .then(user => {
      if (!user) return;

      console.log('i ran');

      sessionStorage.setItem('user', JSON.stringify(user));

      redirect(user);
    })
    .catch(() => {});
}
