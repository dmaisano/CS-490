import { removeChildren } from '../scripts/utils';

interface modalConfig {
  title?: string; // optional modal title
  body: string; // html stuffs
}

export function createModal(options: modalConfig) {
  const { title, body } = options;

  const modalBox: HTMLDivElement = document.querySelector('body #modal-box');

  modalBox.classList.remove('hidden');
  modalBox.classList.add('modal-box');

  // remove any existing elems
  removeChildren(modalBox);

  // create the modal
  const modal = document.createElement('div');
  modal.setAttribute('class', 'card modal');

  if (title) {
    const modalTitle = document.createElement('div');
    modalTitle.setAttribute('class', 'card-title');
    modalTitle.innerHTML = title;
    modal.appendChild(modalTitle);
  }

  if (body) {
    const modalBody = document.createElement('div');
    modalBody.setAttribute('class', 'card-body');
    modalBody.innerHTML = body;
    modal.appendChild(modalBody);
  }

  // create the dismiss button
  const modalFooter = document.createElement('div');
  modalFooter.setAttribute('class', 'card-footer');
  modalFooter.innerHTML = /*html*/ `
    <button type="button" id="dismiss-btn" class="btn btn-danger">Dismiss</button>
  `;

  modal.appendChild(modalFooter);

  modalBox.appendChild(modal);

  // add dismiss event
  modalBox.querySelector('#dismiss-btn').addEventListener('click', () => {
    modalBox.classList.add('hidden');
    modalBox.classList.remove('modal-box');

    removeChildren(modalBox);
  });
}
