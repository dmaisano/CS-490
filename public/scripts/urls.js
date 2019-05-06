/**
 * export backend urls
 */

const baseUrl = `http://localhost:3000/api`;

export const urls = {
  login: `${baseUrl}/login`,
  getTopics: `${baseUrl}/topics`,
  getQuestions: `${baseUrl}/questions`,
  createQuestion: `${baseUrl}/questions/add`,
  getExams: `${baseUrl}/exams`,
  createExam: `${baseUrl}/exams/add`,
};

// 'https://web.njit.edu/~jps78/middle/sendingCurl.php'
