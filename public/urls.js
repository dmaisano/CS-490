export const isDev = true;

const baseUrl = isDev
  ? `https://rare-shrimp-33.localtunnel.me/api`
  : `https://web.njit.edu/~dm583/490/back`;

export const DEV_URLS = {
  login: `${baseUrl}/login`,
  questions: `${baseUrl}/questions`,
  questionsAdd: `${baseUrl}/questions/add`,
  topics: `${baseUrl}/topics`,
  exams: `${baseUrl}/exams`,
  addExam: `${baseUrl}/exams/add`,
  grades: `${baseUrl}/grades`,
  addGrade: `${baseUrl}/grades/add`,
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
