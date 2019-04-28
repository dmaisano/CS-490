import { postObj } from '../scripts/fetch.js';
import { urls } from '../scripts/urls.js';
import { convertQuestion } from '../scripts/utils.js';

/**
 * render the list of questions
 * @param {string} query
 */
export function renderQuestions(query, questionBank) {
  const bank = document.querySelector(query);

  if (questionBank.length < 1) return;

  while (bank.firstChild) {
    bank.removeChild(bank.firstChild);
  }

  // populate the questions
  for (const question of questionBank) {
    const id = convertQuestion(question.question_name, 'id');
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', id);
    elem.setAttribute('data-function_name', question.function_name);
    elem.setAttribute('data-difficulty', question.difficulty);
    elem.setAttribute('data-topic', question.topic);

    const markUp = `
      <input type="text" value="${question.question_name}" disabled />
      <input type="text" value="${question.topic}" disabled />
      <input type="text" value="${question.difficulty}" disabled />
    `;

    elem.innerHTML = markUp;
    bank.appendChild(elem);
  }
}

/**
 * get and render the list of topics
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
