import { createElem } from '../scripts/utils';

export function LoginHandler(root: HTMLDivElement) {
  root.innerHTML = LoginPage;

  const card = root.querySelector('.login-card');

  const btn = createElem({
    type: 'button',
    innerHTML: `click me`,
  });

  root.appendChild(btn);

  console.log({
    card,
    btn,
  });
}

const LoginPage: string = /*html*/ `
  <div class="login-card mdl-card mdl-shadow--2dp">
    <div class="mdl-card__title">
      <h2 class="mdl-card__title-text">Welcome</h2>
    </div>
    <div class="mdl-card__supporting-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Mauris sagittis pellentesque lacus eleifend lacinia...
    </div>
    <div class="mdl-card__actions mdl-card--border">
      <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Get Started
      </a>
    </div>
    <div class="mdl-card__menu">
      <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        <i class="material-icons">share</i>
      </button>
    </div>
  </div>
`;
