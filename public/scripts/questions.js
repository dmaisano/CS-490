import { postObj } from '../scripts/fetch.js';
import { urls } from '../scripts/urls.js';
import { convertQuestion } from '../scripts/utils.js';

/**
 * render the question bank
 * @param {Element} bank DOM element containing the question bank
 * @param {Array} questions array of question objects
 * @param {string} type general purpose flag
 */
export function renderQuestionBank(bank = null, questions = [], type = '') {
  if (!bank) {
    console.error('renderQuestionBank: missing bank element');
  } else if (questions === [] || questions.length < 1) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.innerHTML = `
      <input
        type="text"
        style="grid-column: span 3"
        value="No Questions"
        disabled
      />
    `;
    bank.appendChild(elem);
    return;
  }

  // Remove all existing / placeholder questions
  for (const question of bank.querySelectorAll('.question')) {
    question.parentNode.removeChild(question);
  }

  // for (let index = 0; index < 10; index++) {
  // populate the questions
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    // convert the question name to a valid ID
    const id = convertQuestion(question.question_name, 'id');

    // create new question elem
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', id);
    elem.setAttribute('data-index', i);
    // elem.setAttribute('data-function_name', question.function_name);
    // elem.setAttribute('data-difficulty', question.difficulty);
    // elem.setAttribute('data-topic', question.topic);

    let markUp = '';

    switch (type) {
      case 'add':
        markUp = `
            <input type="text" value="${question.question_name}" disabled />
            <input type="text" value="${question.topic}" disabled />
            <input type="text" value="${question.difficulty}" disabled />
            <button type="button" class="btn btn-success" onclick="addExamQuestion(${i})"><i class="fas fa-plus"></i></button>
          `;
        break;

      default:
        markUp = `
            <input type="text" value="${question.question_name}" disabled />
            <input type="text" value="${question.topic}" disabled />
            <input type="text" value="${question.difficulty}" disabled />
          `;
        break;
    }

    elem.innerHTML = markUp;
    bank.appendChild(elem);
  }
  // }
}

export function filterQuestionBank(filter = '', elem = '', questionBnk = []) {
  return 'owo';
}

/**
 * render the list of topics
 */
export function renderTopics() {
  postObj(urls.getTopics, {})
    .then(res => res.json())
    .then(res => {
      const elems = document.querySelectorAll('#topics');

      for (const el of elems) {
        for (const topic of res) {
          const option = document.createElement('option');
          option.text = topic;
          el.add(option, null);
        }
      }
    });
}
