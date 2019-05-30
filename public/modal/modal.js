import { createElem, removeChildren } from '../utils.js';

const modalBox = document.querySelector(`body #modal-box`);

export function createModal(options = {}) {
  const { title, body } = options;

  modalBox.classList.remove('hidden');

  const modal = createElem({
    className: 'card',
  });

  modal.innerHTML = /*html*/ `
    <div class="card-title">
      <h1>${title}</h1>
    </div>

    <div class="card-body">
      ${body}
    </div>

    <div class="card-footer">
      <button type="submit" id="dismiss-modal" class="btn btn-danger">
        Dismiss
      </button>
    </div>
  `;

  modal
    .querySelector('.card-footer #dismiss-modal')
    .addEventListener('click', () => {
      modalBox.classList.add('hidden');
      removeChildren(modalBox);
    });

  modalBox.appendChild(modal);
}
