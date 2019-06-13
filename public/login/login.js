import { navigateUrl, postRequest, User } from '../utils.js';
import { alertModal } from '../modal/modal.js';

/**
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

async function login() {
  const user = document.querySelector(`.login .card-body input:nth-child(1)`)
    .value;
  const pass = document.querySelector(`.login .card-body input:nth-child(2)`)
    .value;

  try {
    const res = await postRequest('login', {
      user,
      pass,
    });

    console.log(res);

    if (res.type !== 'student' && res.type !== 'instructor') {
      errorModal();
    } else {
      localStorage.setItem(
        'user',
        JSON.stringify(new User(res.user, res.type))
      );

      // navigate to the user's home page
      navigateUrl('#/home');
    }
  } catch (error) {
    errorModal();

    console.error({
      login: error,
    });
  }
}

/**
 * @returns {string}
 */
function LOGIN_PAGE() {
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
}

function errorModal() {
  return alertModal('Login Error', 'Failed to Log In');
}
