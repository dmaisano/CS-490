/**
 * export backend urls
 */

const baseUrl = `http://localhost:3000/api`;

export const urls = {
  login: `${baseUrl}/login`,

  getTopics: `${baseUrl}/topics`,

  // questions
  getQuestions: `${baseUrl}/questions`,
  createQuestion: `${baseUrl}/questions/add`,

  // exams
  getExams: `${baseUrl}/exams`,
  createExam: `${baseUrl}/exams/add`,

  // grades
  getExams: `${baseUrl}/grades`,
  grader: `${baseUrl}/grader`,
};

// 'https://web.njit.edu/~jps78/middle/sendingCurl.php'
