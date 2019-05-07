/**
 * export backend urls
 */

const baseUrl = 'https://web.njit.edu/~jps78/middle/sendingCurl.php';

export const urls = {
  login: baseUrl,
  getStudents: baseUrl,

  getTopics: baseUrl,

  // questions
  getQuestions: baseUrl,
  createQuestion: baseUrl,

  // exams
  getExams: baseUrl,
  createExam: baseUrl,

  // grades
  grader: baseUrl,
  getGrades: baseUrl,
  addGrade: baseUrl,
  updateGrade: baseUrl,
};

// 'https://web.njit.edu/~jps78/middle/sendingCurl.php'
