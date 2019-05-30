import highlander from '../assets/img/highlander.png';
import './login.scss';
import { postRequest } from '../scripts/utils';
import { urls } from '../scripts/urls';
import { createModal } from '../modal/modal';

export function LoginHandler(root: HTMLDivElement) {
  root.innerHTML = LoginPage;

  const card = root.querySelector(`.login .card`);

  card.querySelector<HTMLImageElement>(`.card-image > img`).src = highlander;

  const btn = card.querySelector<HTMLButtonElement>(`.btn-submit`);

  btn.addEventListener('click', () => {
    login();
  });
}

function login() {
  const user: string = document.querySelector<HTMLInputElement>(
    `.login .card-body input:nth-child(1)`
  ).value;
  const pass: string = document.querySelector<HTMLInputElement>(
    `.login .card-body input:nth-child(2)`
  ).value;

  console.log({
    user,
    pass,
  });

  postRequest(urls.login, {
    user,
    pass,
  })
    .then(res => res.json())
    .then((res: { njit: boolean; db: boolean }) => {
      const njitResponse =
        res.njit === true ? 'NJIT Likes You' : 'NJIT Does Not Like You';
      const dbResponse =
        res.db === true ? 'The DB Likes You' : 'The DB Does Not Like You';

      const modalBody = /*html*/ `
        <div>${njitResponse}</div>
        <div>${dbResponse}</div>
      `;

      // create the modal
      createModal({
        title: 'POST Response',
        body: modalBody,
      });
    })
    .catch(err => {
      console.log(err);
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
        <button type="submit" class="btn btn-submit">
          Login
        </button>
      </div>
    </div>
  </div>
`;
