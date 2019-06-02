export const isDev = true;

const baseUrl = isDev
  ? `http://localhost:3000/api`
  : `https://web.njit.edu/~ld277/beta/back`;

export const DEV_URLS = {
  login: `${baseUrl}/login`,
};

export const AFS_URLS = {
  login: `${baseUrl}/login/login.php`,
};
