import highlander from '../assets/img/highlander.png';
import './login.scss';

window['login'] = login;

export function LoginHandler(root: HTMLDivElement) {
  root.innerHTML = LoginPage;

  const card = root.querySelector(`.login .card`);

  const cardImage: HTMLImageElement = card.querySelector(`.card-image > img`);
  cardImage.src = highlander;
}

function login() {
  const user: HTMLInputElement = document.querySelector(
    `.login .card-body input:nth-child(1)`
  );
  const pass: HTMLInputElement = document.querySelector(
    `.login .card-body input:nth-child(2)`
  );

  console.log({
    user: user.value,
    pass: pass.value,
  });
}

const LoginPage: string = /*html*/ `
  <div class="login-bg"></div>

  <div class="login">
    <div class="card">
      <div class="card-image">
        <img src="">
      </div>

      <div class="card-title">CS 490 Login</div>

      <div class="card-body">
        <input type="text" id="user" placeholder="Username" />
        <input type="password" id="pass" placeholder="Password" />
      </div>

      <div class="card-footer">
        <button type="submit" class="btn btn-submit" onclick="login()">
          Login
        </button>
      </div>
    </div>
  </div>
`;
