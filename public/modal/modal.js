import { removeChildren } from '../utils.js';

const modalBox = document.querySelector(`body #modal-box`);

/**
 * @param {string} title
 * @param {string} message
 */
export function alertModal(title = '', body = '') {
  modalBox.classList.remove('hidden');

  // remove any existing modals
  removeChildren(modalBox);

  const modal = document.createElement('div');
  modal.setAttribute('class', 'card alert');

  modal.innerHTML = /*html*/ `
    <div class="card-title ${title === '' ? 'hidden' : ''}">
      <button class="btn invisible">X</button>
      <h1>${title}</h1>
      <button type="button" id="dismiss-modal" class="btn btn-danger">X</button>
    </div>

    <div class="card-body ${body === '' ? 'hidden' : ''}">
      ${body}
    </div>
  `;

  modalBox.appendChild(modal);

  modal.querySelector('#dismiss-modal').addEventListener('click', () => {
    modalBox.classList.add('hidden');
    removeChildren(modalBox);
  });
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

      <h2 class="title ${constraints.length < 1 ? 'hidden' : ''}">
        Constraints
      </h2>

      <div class="constraints ${constraints.length < 1 ? 'hidden' : ''}"></div>

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
   * @returns {HTMLHeadingElement}
   */
  function createConstraint(text) {
    const elem = document.createElement('h3');

    elem.innerHTML = text;
    return elem;
  }

  if (constraints.length) {
  }

  if (constraints.length) {
    constraintsElem = modal.querySelector('.constraints');

    if (constraints.includes('if')) {
      constraintsElem.appendChild(createConstraint('If Statement'));
    }
    if (constraints.includes('print')) {
      constraintsElem.appendChild(createConstraint('Print Statement'));
    }
    if (constraints.includes('for')) {
      constraintsElem.appendChild(createConstraint('For Loop'));
    }
    if (constraints.includes('while')) {
      constraintsElem.appendChild(createConstraint('While Loop'));
    }
  }

  for (const test_case of test_cases) {
    console.log(test_case);

    const elem = document.createElement('div');
    elem.setAttribute('id', 'test_case');

    elem.innerHTML = /*html*/ `
      <input type="text" disabled/>
      <input type="text" disabled/>
    `;

    modal.querySelector('.test_cases').appendChild(elem);

    elem.querySelector('input:nth-child(1)').value = test_case[0];
    elem.querySelector('input:nth-child(2)').value = test_case[1];
  }

  modal.querySelector('#dismiss-modal').addEventListener('click', () => {
    modalBox.classList.add('hidden');
    removeChildren(modalBox);
  });
}
