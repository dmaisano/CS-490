import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';

let questionBank = [];

window.filterSubmit = filterSubmit;
window.assignQuestion = assignQuestion;
window.removeQuestion = removeQuestion;
window.createQuestion = createQuestion;
window.toggleDescription = toggleDescription;
window.getQuestions = getQuestions;

(function() {
  redirect('instructor');
  getQuestions();

  // get the list of topics
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

// function getQuestionIndex(id) {
//   const question_name = id.split('_').join(' ');

//   let res = 0;
//   for (let i = 0; i < questionBank.length; i++) {
//     if (questionBank[i].question_name === question_name) {
//       res = i;
//       break;
//     }
//   }

//   return res;
// }

/**
 * render the list of questions
 * @param {string} url
 */
function renderQuestions(reset = false) {
  const bank = document.querySelector('.bank');

  const examQuestions = document.querySelector('.exam > .questions');

  while (bank.firstChild) {
    bank.removeChild(bank.firstChild);
  }

  // returns true if the question is added to the exam
  // function isDuplicate() {}

  // populate the questions
  for (const question of questionBank) {
    const id = question.question_name.split(' ').join('_');
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', id);

    const markUp = `
      <input type="text" value="${question.question_name}" disabled />
      <button type="button" class="btn btn-success" style="padding: 0.5rem 0.75rem;" onclick="assignQuestion('${id}')">
        +
      </button>
    `;

    elem.innerHTML = markUp;
    bank.appendChild(elem);
  }
}

// add question to the exam
function assignQuestion(id) {
  const examQuestions = document.querySelector('.exam > .questions');

  // hide the elem
  const questionElem = document.querySelector(`.bank > #${id}`);
  questionElem.style.display = 'none';

  const question_name = id.split('_').join(' ');

  let index = 0;
  for (let i = 0; i < questionBank.length; i++) {
    if (questionBank[i].question_name === question_name) {
      index = i;
      break;
    }
  }

  const question = questionBank[index];

  const elem = document.createElement('div');
  elem.setAttribute('class', 'question');
  elem.setAttribute('id', id);

  const markUp = `
    <input type="text" value="${question.question_name}" disabled />
    <input type="text" placeholder="Points" required />
    <button
      type="button"
      class="btn btn-secondary"
      onclick="toggleDescription('.exam > .questions > #${id} > textarea')"
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

  // renderQuestions();
}

function sortQuestions(a, b) {
  if (a.question_name < b.question_name) {
    return -1;
  } else if (a.question_name > b.question_name) {
    return 1;
  }

  return 0;
}

// add the question to DB
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
  const elem = document.querySelector(`.exam > .questions > #${id}`);

  const examQuestions = document.querySelector(`.exam > .questions`);
  examQuestions.removeChild(elem);

  // set back to visible
  const questionElem = document.querySelector(`.bank > #${id}`);
  questionElem.style.display = 'grid';
}

// toggle the visibility of the question's description
function toggleDescription(query, textarea = false) {
  const elem = document.querySelector(query);

  if (!elem) return;

  const visibility = elem.style.display;

  if (visibility === 'none') {
    elem.style.display = 'inherit';
    if (textarea) {
      elem.style.height = `${textarea.scrollHeight}px`;
    }
  } else {
    elem.style.display = 'none';
  }
}
