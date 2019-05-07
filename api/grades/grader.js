const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const platform = process.platform;

// grades and adds a student's exam to the DB
exports.grader = function(db) {
  return (req, res) => {
    const { user, student_responses } = req.body;

    const fileName = path.join(__dirname, 'code.py');

    if (student_responses === undefined) {
      console.log('owo');
      return res.json(returnError('missing responses'));
    }

    // TODO: read file line by line
    for (let i = 0; i < student_responses.length; i++) {
      const code = student_responses[i];

      fs.writeFile(fileName, code, err => {
        if (err) {
          return res.json(returnError(err));
        }

        runPythonCode(fileName).then(res => {
          console.log({
            res,
          });
        });
      });
    }

    return res.json(req.body);

    return res.json({
      success: true,
    });
  };
};

function returnError(msg = '') {
  return {
    err: true,
    msg,
  };
}

function runPythonCode(fileName, args, output) {
  return new Promise((resolve, reject) => {
    const python = platform === 'win32' ? 'python' : 'python3';

    const pythonProg = spawn(python, [fileName]);

    console.log({
      python,
      fileName,
    });

    pythonProg.stderr.on('data', data => {
      reject(data);
    });

    pythonProg.stdout.on('data', data => {
      resolve(data);
    });
  });
}
