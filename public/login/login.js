import { createModal } from '../modal/modal.js';
import { postRequest } from '../utils.js';

/**
 * Login Logic
 * @param {HTMLDivElement} root
 */
export function LoginHandler(root) {
  root.innerHTML = LoginPage;

  const card = root.querySelector(`.login .card`);

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
    console.log(res);
  });
}

const LoginPage = /*html*/ `
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
