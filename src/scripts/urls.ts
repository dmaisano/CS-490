// enviornment variable
const isDev = true;

const baseUrl = isDev ? `http://127.0.0.1:3000` : `lawrence's url`;

export const urls = {
  login: `${baseUrl}/back/login/login.php`,
};
