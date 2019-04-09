import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';

let filter = {};

window.filterSubmit = filterSubmit;
window.createQuestion = createQuestion;
// window.autosize = autosize;

(function() {
  redirect('instructor');

  autosize();
  setTopics();
})();

function setTopics() {
  postObj('http://localhost:4200/api/topics', {})
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

function getQuestions() {
  postObj('http://localhost:4200/api/topics', {})
    .then(res => res.json())
    .then(res => {
      const topics = document.querySelector('#topics');

      for (const topic of res) {
        const option = document.createElement('option');
        option.text = topic;
        topics.add(option, null);
      }
    });
}

function createQuestion() {
  const name = document.querySelector('.newQuestion #name').value || '';
  const functionName =
    document.querySelector('.newQuestion #functionName').value || '';
  const topic =
    document.querySelector('.newQuestion #topics').selectedOptions[0].value ||
    '';
  const difficulty =
    document.querySelector('.newQuestion #difficulty').selectedOptions[0]
      .value || '';
  const description =
    document.querySelector('.newQuestion #description').value || '';

  const question = {
    name,
    functionName,
    topic,
    difficulty,
    description,
  };

  postObj('http://localhost:4200/api/questions/add', question)
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
}

function filterSubmit() {
  const questionName = document.querySelector('#questionName').value || '';
  const difficulty =
    document.querySelector('#difficulty').selectedOptions[0].value || '';
  const topic =
    document.querySelector('#topics').selectedOptions[0].value || '';

  filter = {
    questionName,
    difficulty,
    topic,
  };

  return filter;
}
