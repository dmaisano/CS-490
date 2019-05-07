import { redirect } from '../scripts/redirect.js';
import { getUser, convertName } from '../scripts/utils.js';
import { postObj } from '../scripts/fetch.js';
import { urls } from '../scripts/urls.js';

window.viewGrade = viewGrade;
window.selectStudent = selectStudent;
// window.editStudentGrade = editStudentGrade;

const examType = sessionStorage.getItem('exam-type');
let user;
let selectedStudent;
let selectedGrade;

(function() {
  redirect().then(() => {
    user = getUser();

    switch (examType) {
      case 'instructor-grades':
        const studentLinks = document.querySelector('.student-links');
        studentLinks.classList.remove('hidden');

        renderStudentLinks();

        break;

      // student grades
      default:
        const gradeLinks = document.querySelector('.grade-links');
        gradeLinks.classList.remove('hidden');

        renderGradeLinks();
        break;
    }
  });
})();

async function renderStudentLinks() {
  const container = document.querySelector('.student-links .container');

  let students = await postObj(urls.getStudents, user);
  students = await students.json();

  if (students.length < 1) {
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('disabled', '');
    link.innerHTML = `No Students`;

    container.appendChild(link);
    return;
  }

  for (const student of students) {
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('data-student', student.user);
    link.setAttribute('onclick', `selectStudent('${student.user}')`);

    link.innerHTML = `${student.user}`;

    container.appendChild(link);
  }
}

function selectStudent(student) {
  selectedStudent = student;

  console.log(selectedStudent);

  const studentLinks = document.querySelector('.student-links');
  studentLinks.classList.add('hidden');

  const gradeLinks = document.querySelector('.grade-links');
  gradeLinks.classList.remove('hidden');

  renderGradeLinks({ user: selectedStudent, type: 'student' }, true);
}

async function renderGradeLinks(user = getUser(), instructor = false) {
  const container = document.querySelector('.grade-links .container');

  let grades = await postObj(urls.getGrades, user);
  grades = await grades.json();

  if (grades.length < 1) {
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('disabled', '');
    link.innerHTML = `No Grades`;

    container.appendChild(link);
    return;
  }

  for (let i = 0; i < grades.length; i++) {
    const grade = grades[i];
    const link = document.createElement('button');

    link.setAttribute('type', 'button');
    link.setAttribute('class', 'btn');
    link.setAttribute('id', convertName(grade.exam_name, 'id'));
    link.setAttribute('data-index', i);

    if (instructor) {
      link.setAttribute('onclick', `viewGrade(${i})`);
    } else {
      link.setAttribute('onclick', `viewGrade(${i})`);
    }

    link.innerHTML = `${grade.exam_name}`;

    container.appendChild(link);
  }
}

async function editStudentGrade(index) {
  let grades = await postObj(urls.getGrades, user);
  grades = await grades.json();

  document.querySelector('.student-links').classList.add('hidden');

  const gradeElem = document.querySelector('.grade');
  gradeElem.classList.remove('hidden');
  document.querySelector('.grade-links').classList.add('hidden');

  const grade = grades[index];

  const totalGrade = grade.points_earned.reduce(
    (total, points) => (total += points)
  );

  const titleElems = gradeElem.querySelectorAll('.card-title');
  titleElems[0].innerHTML = `${grade.exam_name}`;
  titleElems[1].innerHTML = `Total: ${totalGrade}`;

  selectedGrade = grade;

  let questions = await postObj(urls.getQuestions, {
    question_ids: grade.question_ids,
  });
  questions = await questions.json();
}

async function viewGrade(index) {
  let grades = [];

  if (getUser().type === 'instructor') {
    grades = await postObj(urls.getGrades, {
      user: selectedStudent,
      type: 'student',
    });
  } else {
    grades = await postObj(urls.getGrades, user);
  }

  grades = await grades.json();

  document.querySelector('.student-links').classList.add('hidden');

  const gradeElem = document.querySelector('.grade');
  gradeElem.classList.remove('hidden');
  document.querySelector('.grade-links').classList.add('hidden');

  const grade = grades[index];

  const totalGrade = grade.points_earned.reduce(
    (total, points) => (total += points)
  );

  const titleElems = gradeElem.querySelectorAll('.card-title');

  titleElems[0].innerHTML = `${grade.exam_name}`;
  titleElems[1].innerHTML = `Total: ${totalGrade}`;

  // .innerHTML = `${grade.exam_name}`;

  let questions = await postObj(urls.getQuestions, {
    question_ids: grade.question_ids,
  });
  questions = await questions.json();

  const questionsElem = gradeElem.querySelector('.questions');
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    let {
      student_responses,
      points_earned,
      points_max,
      instructor_comments,
    } = grade;

    const code = student_responses[i];
    points_earned = points_earned[i];
    points_max = points_max[i];
    const comments = instructor_comments[i];

    let elem = document.createElement('div');
    elem.setAttribute('class', 'question');

    let markup;

    switch (examType) {
      // student grades
      default:
        markup = `
          <label class="points">Points: ${points_earned} / ${points_max}</label>
          <textarea name="description" class="description" rows="5" readonly></textarea>
          <textarea name="code" class="code" placeholder="Code"></textarea>
          <textarea name="comments" class="comments" placeholder="Comments"></textarea>
        `;
        break;
    }

    elem.innerHTML = markup;
    questionsElem.appendChild(elem);

    elem = questionsElem.querySelectorAll('.question')[i];

    const description = elem.querySelector('.description');
    description.value = question.question_description;
    description.style.height = `${description.scrollHeight}px`;

    const codebox = elem.querySelector('.code');
    codebox.value = code;
    codebox.style.height = `${codebox.scrollHeight}px`;

    const commentBox = elem.querySelector('.comments');
    commentBox.value = comments;
    commentBox.style.height = `${commentBox.scrollHeight}px`;
  }
}
