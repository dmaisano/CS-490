import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { urls } from '../scripts/urls.js';

// reference: https://stackoverflow.com/questions/44590393/es6-modules-undefined-onclick-function-after-import
// tldr; globally exposing the function as per the nature of ES6 modules

window.login = login;

document.querySelector('#password').addEventListener('keyup', (event) => {
  if (event.key !== 'Enter') return;

  login();

  event.preventDefault();
});

function login() {
  const user = document.querySelector('#username').value || '';
  const pass = document.querySelector('#password').value || '';

  console.log({
    user,
    pass,
  });

  postObj(urls.login, {
    user,
    pass,
  })
    .then((res) => {
      if (res.status !== 200) {
        alert('Failed To Log In');
        return false;
      }

      return res.json();
    })
    .then((user) => {
      console.log(user);

      if (!user) return;

      localStorage.setItem('user', JSON.stringify(user));

      redirect('login');
    })
    .catch(() => {
      alert('Failed to Log In');
    });
}
