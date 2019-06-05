export const isDev = true;

const baseUrl = isDev
  ? `https://old-wasp-3.localtunnel.me/api`
  : `https://web.njit.edu/~ld277/beta/back`;

export const DEV_URLS = {
  login: `${baseUrl}/login`,
  questions: `${baseUrl}/questions`,
  questionsAdd: `${baseUrl}/questions/add`,
  topics: `${baseUrl}/topics`,
};

export const AFS_URLS = {
  login: `${baseUrl}/login/login.php`,
  questions: `${baseUrl}/questions/questions.php`,
  questionsAdd: `${baseUrl}/questions/questionsAdd.php`,
  topics: `${baseUrl}/topics/topics.php`,
};
