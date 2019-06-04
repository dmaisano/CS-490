import { navigateUrl, postRequest, User } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function LoginHandler(root) {
  root.innerHTML = LOGIN_PAGE();

  const card = root.querySelector(`.login .card`);

  for (const input of card.querySelectorAll('input')) {
    input.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        login();
      }
    });
  }

  const btn = card.querySelector(`#login-submit`);

  btn.addEventListener('click', () => {
    login();
  });
}

function login() {
  const user = document.querySelector(`.login .card-body input:nth-child(1)`)
    .value;
  const pass = document.querySelector(`.login .card-body input:nth-child(2)`)
    .value;

  postRequest('login', {
    user,
    pass,
  }).then(res => {
    if (res.success !== false && res.type) {
      // save the user to local storage
      localStorage.setItem(
        'user',
        JSON.stringify(new User(user, pass, res.type))
      );

      navigateUrl('#/home');
    } else {
      // error modal
    }
  });
}

/**
 * @returns {string}
 */
const LOGIN_PAGE = function() {
  return /*html*/ `
  <div class="login-bg"></div>

  <div class="login">
    <div class="card">
      <div class="card-image"></div>

      <div class="card-title">CS 490 Login</div>

      <div class="card-body">
        <input type="text" id="user" placeholder="Username" />
        <input type="password" id="pass" placeholder="Password" />
      </div>

      <div class="card-footer">
        <button type="submit" id="login-submit" class="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  </div>
`;
};
