export const isDev = false;

const baseUrl = isDev
  ? `http://localhost:5000` // localhost php
  : `https://web.njit.edu/~dm583/CS-490/back`; // lawrence

export const URLS = {
  login: `${baseUrl}/login/login.php`,
  questions: `${baseUrl}/questions/get.php`,
  questionsAdd: `${baseUrl}/questions/add.php`,
  topics: `${baseUrl}/topics.php`,
  exams: `${baseUrl}/exams/get.php`,
  addExam: `${baseUrl}/exams/add.php`,
  grades: `${baseUrl}/grades/get.php`,
  // autoGrade: `${baseUrl}/grades/add.php`,
  addGrade: `${baseUrl}/grades/add.grade.php`,
  updateGrade: `${baseUrl}/grades/update.php`,
  students: `${baseUrl}/students.php`,
};
