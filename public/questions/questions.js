import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';
import { urls } from '../scripts/urls.js';

import { renderQuestions, renderTopics } from '../scripts/questions';

let questionBank = [];

(function() {
  redirect('instructor');

  // get the questions from the DB
  postObj(urls.getQuestions, {})
    .then(res => res.json())
    .then(res => {
      questionBank = res;
    })
    .then(() => {
      renderQuestions();
    });

  renderTopics();
})();
