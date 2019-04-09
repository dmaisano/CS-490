import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';

let filter = {};
let questionBank = [];

window.filterSubmit = filterSubmit;
window.addQuestion = addQuestion;
window.createQuestion = createQuestion;

(function() {
  redirect('instructor');
  getQuestions();
  setTopics();
  autosize();
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

/**
 * render the list of questions
 * @param {string} url
 */
function getQuestions(fetch = true) {
  const bank = document.querySelector('.bank > .card-body');

  // remove existing questions
  function clearQuestions() {
    while (bank.firstChild) {
      bank.removeChild(bank.firstChild);
    }
  }

  // populate the questions
  function createElements() {
    for (const question of questionBank) {
      const elem = document.createElement('div');
      elem.setAttribute('class', 'question');
      elem.setAttribute('id', question.id);

      const markUp = `
        <input type="text" value="${question.question_name}" disabled />
        <button type="button" class="btn btn-success" onclick="addQuestion(${
          question.id
        })">
          Add
        </button>
      `;

      elem.innerHTML = markUp;
      bank.appendChild(elem);
    }
  }

  if (fetch) {
    postObj('http://localhost:4200/api/questions', {})
      .then(res => res.json())
      .then(res => {
        clearQuestions();

        questionBank = res;
      })
      .then(() => {
        createElements();
      });
  }

  function createElements() {
    const bank = document.querySelector('.bank .card-body');

    for (const question of questionBank) {
      const elem = document.createElement('div');
      elem.setAttribute('class', 'question');
      elem.setAttribute('id', question.id);

      const markUp = `
      <input type="text" value="${question.question_name}" disabled />
      <button type="button" class="btn btn-success" onclick="addQuestion(${
        question.id
      })">
        Add
      </button>
      `;

      elem.innerHTML = markUp;

      bank.appendChild(elem);
    }
  }
}

// add question to the current exam
function addQuestion(id) {
  console.log({
    id,
  });
}

function createQuestion() {
  const name = document.querySelector('.newQuestion #name');
  const functionName = document.querySelector('.newQuestion #functionName');
  const topicDropdown = document.querySelector('.newQuestion #topics');
  const difficultyDropdown = document.querySelector('.newQuestion #difficulty');
  const description = document.querySelector('.newQuestion #description');

  const topic = topicDropdown.selectedOptions[0].value || '';
  const difficulty = difficultyDropdown.selectedOptions[0].value || '';

  if (
    !name.value ||
    !functionName.value ||
    !topic ||
    !difficulty ||
    !description.value
  ) {
    alert(`Missing Field`);
    return;
  }

  const question = {
    name: name.value,
    functionName: functionName.value,
    topic,
    difficulty,
    description: description.value,
  };

  postObj('http://localhost:4200/api/questions/add', question)
    .then(res => res.json())
    .then(() => {
      // refresh the question bank
      getQuestions();

      // clear the form
      name.value = '';
      functionName.value = '';
      topicDropdown.options[0].selected = true;
      difficultyDropdown.options[0].selected = true;
      description.value = '';
    });

  const descriptionBox = document.querySelector('.newQuestion > #description');
  descriptionBox.style.height = 'inherit';
  descriptionBox.style.height = '76px';
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
