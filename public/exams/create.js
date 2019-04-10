import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';

let questionBank = [];

window.filterSubmit = filterSubmit;
window.addQuestion = addQuestion;
window.removeQuestion = removeQuestion;
window.createQuestion = createQuestion;
window.toggleDescription = toggleDescription;

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

function getQuestions(filter = {}) {
  // fetch the questions from the DB
  postObj('http://localhost:4200/api/questions', filter)
    .then(res => res.json())
    .then(res => {
      questionBank = res;
    })
    .then(() => {
      renderQuestions();
    });
}

/**
 * render the list of questions
 * @param {string} url
 */
function renderQuestions(reset = false) {
  const bank = document.querySelector('.bank > .card-body');

  while (bank.firstChild) {
    bank.removeChild(bank.firstChild);
  }

  // populate the questions
  for (const question of questionBank) {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', question.function_name);

    const markUp = `
      <input type="text" value="${question.question_name}" disabled />
      <button type="button" class="btn btn-success" style="padding: 0.5rem 0.75rem;" onclick="addQuestion('${
        question.function_name
      }')">
        +
      </button>
    `;

    elem.innerHTML = markUp;
    bank.appendChild(elem);
  }
}

// add question to the current exam
function addQuestion(function_name) {
  const examQuestions = document.querySelector('.exam > .questions');

  let index = 0;

  for (let i = 0; i <= questionBank.length; i++) {
    const question = questionBank[i];
    if (question.function_name === function_name) {
      index = i;
      break;
    }
  }

  const question = questionBank[index];

  // remove the element from the question bank
  questionBank.splice(index, 1);

  const id = question.question_name.split(' ').join('_');

  const elem = document.createElement('div');
  elem.setAttribute('class', 'question');
  elem.setAttribute('id', id);

  const markUp = `
    <input type="text" value="${question.question_name}" disabled />
    <input type="text" placeholder="Points" required />
    <button
      type="button"
      class="btn btn-secondary"
      onclick="toggleDescription('${id}')"
    >
      ▼
    </button>
    <button type="button" class="btn btn-danger" onclick="removeQuestion('${id}')">
      X
    </button>
    <textarea rows="3" style="display: none;" disabled>${
      question.question_description
    }</textarea>
  `;

  elem.innerHTML = markUp;
  examQuestions.appendChild(elem);

  renderQuestions();
}

function sortQuestions(a, b) {
  if (a.question_name < b.question_name) {
    return -1;
  } else if (a.question_name > b.question_name) {
    return 1;
  }

  return 0;
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
    question_name: name.value,
    function_name: functionName.value,
    topic,
    difficulty,
    question_description: description.value,
  };

  postObj('http://localhost:4200/api/questions/add', question)
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        alert('Failed to Add Question');
        console.error(res);
        return;
      }

      questionBank.push(question);
      questionBank.sort((a, b) => sortQuestions(a, b)); // sortQuestions();

      // refresh the question bank
      renderQuestions();

      // clear the form
      name.value = '';
      functionName.value = '';
      topicDropdown.options[0].selected = true;
      difficultyDropdown.options[0].selected = true;
      description.value = '';
    });

  // reset the height
  const descriptionBox = document.querySelector('.newQuestion > #description');
  descriptionBox.style.height = 'inherit';
  descriptionBox.style.height = '76px';
}

function filterSubmit() {
  const question_name =
    document.querySelector('.filter-box > #questionName').value || '';
  const difficulty =
    document.querySelector('.filter-box > #difficulty').selectedOptions[0]
      .value || '';
  const topic =
    document.querySelector('.filter-box > #topics').selectedOptions[0].value ||
    '';

  const filter = {
    question_name,
    difficulty,
    topic,
  };

  console.log(filter);

  getQuestions(filter);
}

// remove question from bank, and add back to
function removeQuestion(id) {
  console.log(id);

  const elem = document.querySelector(`#${id}`);
  const question_name = elem.querySelector('input:first-child').value;

  let question;
  // for (const res of originalBank) {
  //   console.log(res);
  //   console.log(question_name);
  //   if (res.question_name === question_name) {
  //     question = res;
  //   }
  // }

  console.log(question);

  questionBank.push(question);

  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }

  // renderQuestions();
  // sortQuestions();
}

// toggle the visibility of the question's description
function toggleDescription(id) {
  console.log(id);

  const textarea = document.querySelector(`#${id} > textarea`);

  const visibility = textarea.style.display;

  if (visibility === 'none') {
    textarea.style.display = 'block';
    textarea.style.height = `${textarea.scrollHeight}px`;
  } else {
    textarea.style.display = 'none';
  }
}
