const { promisify } = require('util');
const path = require('path');
const exec = promisify(require('child_process').exec);

function passwordVerify(password, hash) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.resolve(__dirname, 'password_verify.php');

      const { stdout, stderr } = await exec(
        `php ${filePath} '${password}' '${hash}'`
      );

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout);
    } catch (error) {
      reject(error);
    }
  });
}

exports.login = function(db) {
  return async (req, res, next) => {
    const { user, pass } = req.body;

    try {
      const result = await db.query(`SELECT * FROM users WHERE id = ?`, [user]);
      const hashedPass = result[0].pass;

      // check if password matches
      const passwordMatch = await passwordVerify(pass, hashedPass);

      if (passwordMatch === 'true') {
        return res.json({
          user,
        });
      }

      return res.json({
        success: false,
        message: 'incorrect password',
      });
    } catch (error) {
      return next(error);
    }
  };
};
