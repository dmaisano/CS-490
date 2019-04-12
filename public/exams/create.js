import { postObj } from '../scripts/fetch.js';
import { redirect } from '../scripts/redirect.js';
import { autosize } from '../scripts/autosize.js';

let questionBank = [];

// expose functions to the document window
window.filterQuestions = filterQuestions;
window.assignQuestion = assignQuestion;
window.removeQuestion = removeQuestion;
window.createQuestion = createQuestion;
window.toggleDescription = toggleDescription;
window.addTestCase = addTestCase;
window.removeTestCase = removeTestCase;
window.createExam = createExam;

(function() {
  redirect('instructor');

  // get the questions from the DB
  postObj('http://localhost:4200/api/questions', {})
    .then(res => res.json())
    .then(res => {
      questionBank = res;
    })
    .then(() => {
      renderQuestions();
    });

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

/**
 * returns true if the element exists in the exam preview
 * @param {string} id
 * @returns {boolean}
 */
function isAssigned(id) {
  const examQuestions = document.querySelectorAll('.exam > .questions > *');

  for (const question of examQuestions) {
    if (question.getAttribute('id') === id) {
      return true;
    }
  }

  return false;
}

/**
 * render the list of questions
 * @param {string} url
 */
function renderQuestions() {
  const bank = document.querySelector('.bank');

  while (bank.firstChild) {
    bank.removeChild(bank.firstChild);
  }

  // populate the questions
  for (const question of questionBank) {
    const id = question.question_name.split(' ').join('_');
    const elem = document.createElement('div');
    elem.setAttribute('class', 'question');
    elem.setAttribute('id', id);
    elem.setAttribute('data-function_name', question.function_name);
    elem.setAttribute('data-difficulty', question.difficulty);
    elem.setAttribute('data-topic', question.topic);

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

/**
 * filters the HTML elements in the QUESTION BANK
 * hides the elements if they do not match the filter criteria
 * @param {boolean} reset
 */
function filterQuestions(reset = false) {
  // reset before filtering
  const questions = document.querySelectorAll('.bank > .question');

  if (reset) {
    for (const question of questions) {
      const id = question.getAttribute('id');

      if (!isAssigned(id)) {
        question.style.display = 'grid';
      }

      // question.style.display = 'grid';
    }
    return;
  }

  const question_name =
    document.querySelector('.filter-box > #question_name').value || '';
  const difficulty =
    document.querySelector('.filter-box > #difficulty').selectedOptions[0]
      .value || '';
  const topic =
    document.querySelector('.filter-box > #topics').selectedOptions[0].value ||
    '';

  // no filtering needed
  if (!question_name && !difficulty && !topic) {
    return;
  }

  // loop through each question
  for (const question of questions) {
    if (
      question_name &&
      !question
        .querySelector('input')
        .value.toLowerCase()
        .includes(question_name.toLowerCase())
    ) {
      question.style.display = 'none';
      continue;
    }

    if (difficulty && difficulty != question.getAttribute('data-difficulty')) {
      question.style.display = 'none';
      continue;
    }

    if (topic && topic != question.getAttribute('data-topic')) {
      question.style.display = 'none';
      continue;
    }
  }
}

/**
 * add a question from the bank, to the exam
 * @param {string} id
 */
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
  elem.setAttribute('data-function_name', question.function_name);
  elem.setAttribute('data-difficulty', question.difficulty);
  elem.setAttribute('data-topic', question.topic);

  const markUp = `
    <input type="text" value="${question.question_name}" disabled />
    <input type="text" id="points" placeholder="Points" required />
    <button
      type="button"
      class="btn btn-success"
      onclick="addTestCase('${id}')"
    >
      Add Test Case
    </button>
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
    <div class="test_cases"></div>
    <textarea rows="3" style="display: none;" disabled>${
      question.question_description
    }</textarea>
  `;

  elem.innerHTML = markUp;
  examQuestions.appendChild(elem);

  // add two initial test cases
  addTestCase(id, true);
  addTestCase(id, true);
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
      questionBank.sort((a, b) => {
        if (a.question_name < b.question_name) {
          return -1;
        } else if (a.question_name > b.question_name) {
          return 1;
        }

        return 0;
      });

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

/**
 * toggle the visibility of the textarea element
 * @param {string} query query search string for the element
 */
function removeQuestion(id) {
  const elem = document.querySelector(`.exam > .questions > #${id}`);

  elem.parentNode.removeChild(elem);

  // set back to visible
  const questionElem = document.querySelector(`.bank > #${id}`);
  questionElem.style.display = 'grid';
}

/**
 * toggle the visibility of the textarea element
 * @param {string} query query search string for the element
 */
function toggleDescription(query) {
  const elem = document.querySelector(query);

  if (!elem) return;

  const visibility = elem.style.display;

  if (visibility === 'none') {
    elem.style.display = 'inherit';
    elem.style.height = `${elem.scrollHeight}px`;
  } else {
    elem.style.display = 'none';
  }
}

/**
 * add a field for a question test case
 * @param {string} id
 * @param {boolean} disabled
 */
function addTestCase(id, disabled = false) {
  const questionElem = document.querySelector(`.exam > .questions > #${id}`);
  const testCasesElem = questionElem.querySelector('.test_cases');

  // current number of test cases for the specific question
  const len = questionElem.querySelectorAll('.test_cases > *').length;

  if (len > 6) {
    return;
  }

  const elem = document.createElement('div');
  elem.setAttribute('class', 'test_case');
  elem.setAttribute('id', `${id}_test_case_${len}`);

  let markUp = `
    <input type="text" value="" placeholder="Enter args" required/>
    <input type="text" value="" placeholder="Enter expected output" required/>
    <button type="button" class="btn btn-danger" onclick="removeTestCase('${id}_test_case_${len}')">X</button>
  `;

  if (disabled) {
    markUp = `
      <input type="text" value="" placeholder="Enter args" required/>
      <input type="text" value="" placeholder="Enter expected output" required/>
      <button type="button" class="btn btn-danger" onclick="removeTestCase('${id}_test_case_${len}')" disabled>X</button>
    `;
  }

  elem.innerHTML = markUp;
  testCasesElem.appendChild(elem);
}

/**
 * remove a test case
 * @param {string} id
 */
function removeTestCase(id) {
  const elem = document.querySelector(`.exam > .questions #${id}`);

  elem.parentNode.removeChild(elem);
}

/**
 * submit the exam details to the backend
 */
function createExam() {
  const exam_name = document.querySelector('.exam > #examName').value || '';

  if (!exam_name) {
    alert('Missing exam name!');
    return;
  }

  const examQuestionsHTML = document.querySelectorAll('.exam > .questions > *');

  let question_names = [];

  let function_names = [];

  // array of question points
  let points = [];

  // array of test case objects
  let test_cases = [];

  if (examQuestionsHTML.length < 1) {
    alert('Missing exam questions!');
    return;
  }

  for (const questionElem of examQuestionsHTML) {
    const question_name = questionElem.querySelector('input:first-child').value;
    const function_name = questionElem.getAttribute('data-function_name');
    let questionPoints = questionElem.querySelector('#points').value || '';

    const test_cases_elems = questionElem.querySelectorAll(
      '.test_cases > .test_case'
    );

    let currentCases = [];
    for (const test_case_elem of test_cases_elems) {
      const args =
        test_case_elem.querySelector('input:nth-child(1)').value || '';
      const output =
        test_case_elem.querySelector('input:nth-child(2)').value || '';

      currentCases.push({
        args,
        output,
      });
    }

    if (!questionPoints) {
      alert(`Missing points for question '${question_name}'`);
      return;
    }

    questionPoints = Number.parseInt(questionPoints);

    question_names.push(question_name);
    function_names.push(function_name);
    points.push(questionPoints);
    test_cases.push(currentCases);
  }

  // check if the points all up to 100
  let totalPoints = points.reduce((total, num) => (total += num));

  // floor / ceil login
  if (totalPoints === 99 || totalPoints === 101) {
    totalPoints = 100;
  }

  if (totalPoints !== 100) {
    alert(`Exam must be out of 100 possible max points`);
    return;
  }

  // get the instructor / user
  let instructor = sessionStorage.getItem('user');
  instructor = JSON.parse(instructor).user;

  const requestObj = {
    exam_name,
    instructor,
    question_names,
    function_names,
    points,
    test_cases,
  };

  console.log({
    request: JSON.stringify(requestObj),
  });

  // send to middle / grader
  const url = '';

  if (url) {
    postObj('http://localhost:4200/api/questions', requestObj);
  }
}
