window.filterSubmit = filterSubmit;

import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';

let filter = {};

(function() {
  redirect('instructor');

  setTopics();
})();

function setTopics() {
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

function addQuestion() {
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
