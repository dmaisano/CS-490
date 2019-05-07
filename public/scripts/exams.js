import { convertName, getUser } from '../scripts/utils.js';
import { postObj } from '../scripts/fetch.js';
import { urls } from './urls.js';

const examType = sessionStorage.getItem('exam-type');

export async function renderStudentLinks(container = null) {
  if (!container) {
    container = document.querySelector('.exam-links .container');
  }

  let students = await postObj(urls.getStudents, getUser());
  students = await students.json();

  console.log({
    students,
  });
}

/**
 * Render the exam links
 * @param {Array} exams
 * @param {*} container
 */
export async function renderExamLinks(exams = null, container = null) {
  if (exams === null) return;

  if (!container) {
    container = document.querySelector('.exam-links .container');
  }

  let availableExams = [];

  let takenExams = [];

  if (getUser().type === 'student' && examType === 'take-exam') {
    takenExams = await postObj(urls.getExams, getUser());
    takenExams = await takenExams.json();
  }

  // remove taken exams for students
  if (takenExams.length) {
    for (const exam of exams) {
      for (let j = 0; j < takenExams.length; j++) {
        const takenExam = takenExams[j];

        if (exam.exam_name === takenExam.exam_name) {
          break;
        }

        if (j === takenExams.length - 1) {
          availableExams.push(exam);
        }
      }
    }
  } else {
    for (const exam of exams) {
      availableExams.push(exam);
    }
  }

  if (availableExams.length < 1) {
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('disabled', '');
    link.innerHTML = `No Exams`;

    container.appendChild(link);
    return;
  }

  for (let i = 0; i < availableExams.length; i++) {
    const exam = availableExams[i];

    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('id', convertName(exam.exam_name, 'id'));
    link.setAttribute('data-index', i);
    link.setAttribute('onclick', `viewExam(${i})`);

    link.innerHTML = `${exam.exam_name}`;

    container.appendChild(link);
  }
}

/**
 * select the exam to view
 * @param {Array} exams
 * @param {string} index
 * @param {HTMLElement} links
 * @returns {String | Boolean}
 */
export function selectExam(
  exams,
  index,
  links = document.querySelector('.exam-links')
) {
  const exam = exams[index];

  if (!exam) return false;

  // hide the links and show the exam
  links.classList.add('hidden');

  document.querySelector('.exam').classList.remove('hidden');

  // render the exam
  renderExam(exam);
}

export function renderExam(
  exam = null,
  examElem = document.querySelector('.exam > .card')
) {
  if (exam === null) {
    alert('Failed to Render Exam');
    return;
  }

  if (examType === 'instructor-grades') {
    console.log('owo');
  }

  postObj(urls.getQuestions, {
    question_ids: exam.question_ids,
  })
    .then(res => res.json())
    .then(questions => {
      // set the title
      examElem.querySelector('.card-title').innerHTML = `${exam.exam_name}`;

      questions.forEach((question, index) => {
        renderQuestion(
          question,
          index,
          exam.points_max[index],
          examElem.querySelector('.questions')
        );
      });
    })
    .catch(err => {
      alert('Failed to get Exam Questions');
      console.error(err);
      return;
    });
}

function renderQuestion(
  question,
  index,
  points,
  questionsElem = document.querySelector(
    '.exam > .card > .card-body > .questions'
  )
) {
  let elem = document.createElement('div');
  elem.setAttribute('class', 'question');

  let markup;

  switch (examType) {
    case 'take-exam':
      markup = `
        <label class="points">Points: ${points}</label>
        <textarea name="description" class="description" rows="5" readonly></textarea>
        <textarea name="code" class="code" rows="10" placeholder="Code"></textarea>
      `;
      break;

    case 'instructor-grades':
      markup = `
        <label class="points">Points: ${points}</label>
        <textarea name="description" class="description" rows="5" readonly></textarea>
        <textarea name="code" class="code" rows="10" placeholder="Code"></textarea>
      `;
      break;

    case 'view-exams':
      markup = `
        <label class="points">Points: ${points}</label>
        <textarea name="description" class="description" rows="5" readonly></textarea>
      `;
      break;

    case 'student-grades':
      markup = `
        <label class="points">Points: ${points}</label>
        <textarea name="description" class="description" rows="5" readonly></textarea>
      `;
      break;

    default:
      console.log('owo');
      break;
  }

  elem.innerHTML = markup;
  questionsElem.appendChild(elem);

  // grab the selected elem
  elem = questionsElem.querySelectorAll('.question')[index];

  const description = elem.querySelector('.description');
  description.value = question.question_description;
  description.style.height = `${description.scrollHeight}px`;

  const codebox = document.querySelector('.code');
  if (codebox) {
    // ? override textarea defaults to support tabs
    HTMLTextAreaElement.prototype.getCaretPosition = function() {
      //return the caret position of the textarea
      return this.selectionStart;
    };
    HTMLTextAreaElement.prototype.setCaretPosition = function(position) {
      //change the caret position of the textarea
      this.selectionStart = position;
      this.selectionEnd = position;
      this.focus();
    };
    HTMLTextAreaElement.prototype.hasSelection = function() {
      //if the textarea has selection then return true
      if (this.selectionStart == this.selectionEnd) {
        return false;
      } else {
        return true;
      }
    };
    HTMLTextAreaElement.prototype.getSelectedText = function() {
      //return the selection text
      return this.value.substring(this.selectionStart, this.selectionEnd);
    };
    HTMLTextAreaElement.prototype.setSelection = function(start, end) {
      //change the selection area of the textarea
      this.selectionStart = start;
      this.selectionEnd = end;
      this.focus();
    };

    codebox.addEventListener('keydown', event => {
      const { keyCode } = event;
      const { value, selectionStart, selectionEnd } = codebox;

      // tab
      if (keyCode === 9) {
        event.preventDefault();

        codebox.value =
          value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);

        codebox.setSelectionRange(selectionStart + 2, selectionStart + 2);
      }

      const maxHeight = 275; // px

      codebox.style.height = `${maxHeight}`;
    });
  }
}
