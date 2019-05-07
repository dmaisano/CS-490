const fs = require('fs');
const path = require('path');
const { spawn } = require('promisify-child-process');
const { promisify } = require('util');
const readline = require('readline');

const writeFile = promisify(fs.writeFile);
const platform = process.platform;

exports.grader = function(db) {
  return async (req, res, next) => {
    try {
      const {
        function_names,
        test_cases,
        code,
        points_max,
        question_constraints,
      } = req.body;

      if (code === undefined) {
        res.status(500);
        return res.json({
          error: true,
          msg: 'Missing Fields',
        });
      }

      // data to return
      const student_responses = [];
      const instructor_comments = [];
      const points_earned = [];

      let hasIf = false;
      let hasPrint = false;
      let hasFor = false;
      let hasWhile = false;

      for (let i = 0; i < code.length; i++) {
        const constraints = question_constraints[i];
        const function_name = function_names[i];

        if (constraints.includes('if')) {
          hasIf = true;
          var foundIf = false;
        }
        if (constraints.includes('print')) {
          hasPrint = true;
          var foundPrint = false;
        }
        if (constraints.includes('for')) {
          hasFor = true;
          var foundFor = false;
        }
        if (constraints.includes('if')) {
          hasWhile = true;
          var foundWhile = false;
        }

        let newCode = '';
        let maxPoints = points_max[i];
        let points = maxPoints;
        let comments = '';

        await writeFile(path.join(__dirname, './code.py'), code[i]);

        const lines = await getLines();

        // check if valid func name and constraints
        for (let j = 0; j < lines.length; j++) {
          let line = lines[j];

          const functionDecl = /def (.*).*(\(.*\)):/g.exec(line);

          if (functionDecl) {
            const funcName = functionDecl[1];
            if (funcName && funcName !== function_name) {
              comments += 'Incorrect function name\n';

              // take off 10% and correct it
              line = `def ${function_name}${functionDecl[2]}:`;
              points -= maxPoints * 0.1;
            }
          }

          if (
            hasIf &&
            foundIf !== undefined &&
            !foundIf &&
            line.match(/.*if/g)
          ) {
            foundIf = true;
          }
          if (
            hasPrint &&
            foundPrint !== undefined &&
            !foundPrint &&
            line.match(/.*print(.*)/g)
          ) {
            foundPrint = true;
          }
          if (
            hasFor &&
            foundFor !== undefined &&
            !foundFor &&
            line.match(/.*for/g)
          ) {
            foundFor = true;
          }
          if (
            hasWhile &&
            foundWhile !== undefined &&
            !foundWhile &&
            line.match(/.*while/g)
          ) {
            foundWhile = true;
          }

          newCode += line + '\n';

          if (j === lines.length - 1) {
            // take of 5% for missing constraint(s)
            if (constraints.includes('if') && !foundIf) {
              points -= maxPoints * 0.05;
              comments += 'Missing If Statement\n';
            }
            if (constraints.includes('print') && !foundPrint) {
              points -= maxPoints * 0.05;
              comments += 'Missing Print Statement\n';
            }
            if (constraints.includes('for') && !foundFor) {
              points -= maxPoints * 0.05;
              comments += 'Missing For Loop\n';
            }
            if (constraints.includes('while') && !foundWhile) {
              points -= maxPoints * 0.05;
              comments += 'Missing While Loop\n';
            }

            const testCases = test_cases[i];

            // insert the test case args and run the program
            for (let k = 0; k < testCases.length; k++) {
              const testCase = testCases[k];

              const finalLine = `\n\nprint(${function_name}(${testCase.args}))`;

              // append the test case args
              await writeFile(
                path.join(__dirname, './code.py'),
                newCode + finalLine
              );

              // run the program
              const { stdout, stderr } = await spawn(
                platform === 'win32' ? 'python' : 'python3',
                [path.join(__dirname, './code.py')],
                { encoding: 'utf8' }
              );

              const pointsToRemove = maxPoints / test_cases.length;

              if (stdout === undefined || !stdout) {
                stdout = '';
              }

              if (!stdout.includes(testCase.output.toString())) {
                points -= pointsToRemove;
              }

              if (stderr) {
                points = 0;
                comments = `Failed To Run Code`;
              }
            }

            points = Math.floor(points);

            if (points < 0) {
              points = 0;
            }

            student_responses.push(code[i]);
            instructor_comments.push(comments);
            points_earned.push(points);
          }
        }
      }

      return res.json({
        student_responses,
        instructor_comments,
        points_earned,
      });
    } catch (error) {
      return next(error);
    }
  };
};

async function getLines() {
  return new Promise((resolve, reject) => {
    const lines = [];

    let stream = fs.createReadStream(path.join(__dirname, './code.py'));

    let rl = readline.createInterface({
      input: stream,
    });

    rl.on('line', line => {
      lines.push(line);
    })
      .on('close', () => {
        resolve(lines);
      })
      .on('error', err => {
        reject(err);
      });
  });
}
