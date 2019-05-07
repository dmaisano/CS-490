/**
 * export backend urls
 */

const baseUrl = `http://localhost:3000/api`;
// const baseUrl = 'https://loud-starfish-52.localtunnel.me/api';

export const urls = {
  login: `${baseUrl}/login`,
  getStudents: `${baseUrl}/students`,

  getTopics: `${baseUrl}/topics`,

  // questions
  getQuestions: `${baseUrl}/questions`,
  createQuestion: `${baseUrl}/questions/add`,

  // exams
  getExams: `${baseUrl}/exams`,
  createExam: `${baseUrl}/exams/add`,

  // grades
  grader: `${baseUrl}/grader`,
  getGrades: `${baseUrl}/grades`,
  addGrade: `${baseUrl}/grades/add`,
  updateGrade: `${baseUrl}/grades/update`,
};

// 'https://web.njit.edu/~jps78/middle/sendingCurl.php'
