export const isDev = false;

const baseUrl = isDev
  ? `http://localhost:3000/api`
  : `https://web.njit.edu/~ld277/back`;

export const autoGraderUrl = 'https://web.njit.edu/~bm424/grader.php';

export const DEV_URLS = {
  login: `${baseUrl}/login`,
  questions: `${baseUrl}/questions`,
  questionsAdd: `${baseUrl}/questions/add`,
  topics: `${baseUrl}/topics`,
  exams: `${baseUrl}/exams`,
  addExam: `${baseUrl}/exams/add`,
  grades: `${baseUrl}/grades`,
  finalizeGrade: `${baseUrl}/grades/finalize`,
  getStudents: `${baseUrl}/students`,
};

export const AFS_URLS = {
  login: `${baseUrl}/login.php`,
  questions: `${baseUrl}/questions/get.php`,
  questionsAdd: `${baseUrl}/questions/add.php`,
  topics: `${baseUrl}/topics.php`,
  exams: `${baseUrl}/exams/get.php`,
  addExam: `${baseUrl}/exams/add.php`,
  grades: `${baseUrl}/grades/get.php`,
  addGrade: `${baseUrl}/grades/add.php`,
  finalizeGrade: `${baseUrl}/grades/finalize.php`,
  getStudents: `${baseUrl}/students.php`,
};
