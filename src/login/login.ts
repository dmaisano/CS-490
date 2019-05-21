import { createElem } from '../scripts/utils';
import highlander from '../assets/img/highlander.png';
import './login.scss';

export function LoginHandler(root: HTMLDivElement) {
  root.innerHTML = LoginPage;

  const card = root.querySelector(`.login .card`);

  const cardImage: HTMLImageElement = card.querySelector(`.card-image > img`);
  cardImage.src = highlander;

  const btn = createElem({
    type: 'button',
    innerHTML: `click me`,
  });

  root.appendChild(btn);
}

const LoginPage: string = /*html*/ `
  <div class="login-bg"></div>

  <div class="login">
    <div class="card">
      <div class="card-image">
        <img src="">
      </div>

      <div class="card-title">Login</div>

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
