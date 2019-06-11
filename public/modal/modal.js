import { removeChildren } from '../utils.js';

const modalBox = document.querySelector(`body #modal-box`);

export function createModal(options = {}) {
  const { title, body } = options;

  modalBox.classList.remove('hidden');

  // remove any existing modals
  removeChildren(modalBox);

  const modal = document.createElement('div');
  modal.setAttribute('class', 'card');

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

/**
 * @param {Question} question
 */
export function questionInfo(question) {
  const {
    question_name,
    function_name,
    question_description,
    difficulty,
    topic,
    constraints,
    test_cases,
  } = question;

  modalBox.classList.remove('hidden');

  // remove any existing modals
  removeChildren(modalBox);

  const modal = document.createElement('div');
  modal.setAttribute('class', 'card question-info');

  modal.innerHTML = /*html*/ `
    <div class="card-title">
      <button class="btn invisible">X</button>
      <h1>${question_name}</h1>
      <button type="button" id="dismiss-modal" class="btn btn-danger">X</button>
    </div>

    <div class="card-body">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-column-gap: 0.5rem;">
        <div class="form-group">
          <label>Function Name</label>
          <input type="text" id="function_name" disabled/>
        </div>
        <div class="form-group">
          <label>Topic</label>
          <input type="text" id="topic" disabled/>
        </div>
        <div class="form-group">
          <label>Difficulty</label>
          <input type="text" id="difficulty" disabled/>
        </div>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea id="question_description" rows="6" disabled></textarea>
      </div>

      <div class="test_cases_title">
        <h2>Args</h2>
        <h2>Output</h2>
      </div>

      <div class="test_cases"></div>
    </div>
  `;

  modalBox.appendChild(modal);

  modal.querySelector('#function_name').value = function_name;
  modal.querySelector('#topic').value = topic;
  modal.querySelector('#difficulty').value = difficulty;
  modal.querySelector('#question_description').value = question_description;

  // let constraintsElem = modal.querySelector('.constraints');
  let constraintsElem;

  /**
   * @param {string} text
   * @returns {HTMLButtonElement}
   */
  function createBtn(text) {
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary');
    btn.setAttribute('disabled', '');

    btn.innerHTML = text;
    return btn;
  }

  if (constraints.length) {
    constraintsElem = document.createElement('div');
    constraintsElem.setAttribute('class', 'constraints');

    const title = document.createElement('h2');
    title.setAttribute('title');
    title.innerHTML = 'Constraints';

    modal.appendChild(title);
    modal.appendChild(constraintsElem);

    if (constraints.includes('if')) {
      constraintsElem.appendChild(createBtn('If Statement'));
    }
    if (constraints.includes('print')) {
      constraintsElem.appendChild(createBtn('Print Statement'));
    }
    if (constraints.includes('for')) {
      constraintsElem.appendChild(createBtn('For Loop'));
    }
    if (constraints.includes('while')) {
      constraintsElem.appendChild(createBtn('While Loop'));
    }
  }

  for (const test_case of test_cases) {
    console.log(test_case);
  }

  modal.querySelector('#dismiss-modal').addEventListener('click', () => {
    modalBox.classList.add('hidden');
    removeChildren(modalBox);
  });
}
