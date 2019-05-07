exports.getGrades = function(db) {
  return async (req, res) => {
    const user = req.body.user;

    if (user === undefined) {
      res.status(403);
      return res.json({
        error: true,
        message: 'Not Auth',
      });
    }

    let query = `SELECT * FROM grades`;

    // if (user.type === 'student') {
    //   query = `SELECT * FROM grades WHERE student = '${user}'`;
    // }

    db.query(query, (err, grades) => {
      if (err) {
        return res.send(err);
      }

      if (grades.length === 0) {
        return res.json([]);
      }

      for (const exam of grades) {
        grades.question_ids = JSON.parse(exam.question_ids);
        grades.student_responses = JSON.parse(exam.student_responses);
        grades.instructor_comments = JSON.parse(exam.instructor_comments);
        grades.points_earned = JSON.parse(exam.points_earned);
        grades.points_max = JSON.parse(exam.points_max);
      }

      return res.send(grades);
    });
  };
};

exports.getStudentGrades = async function(db, user) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM grades WHERE student = '${user}'`;

    db.query(query, (err, grades) => {
      if (err) {
        reject(err);
      }

      if (grades.length === 0) {
        return resolve([]);
      }

      for (const exam of grades) {
        grades.question_ids = JSON.parse(exam.question_ids);
        grades.student_responses = JSON.parse(exam.student_responses);
        grades.instructor_comments = JSON.parse(exam.instructor_comments);
        grades.points_earned = JSON.parse(exam.points_earned);
        grades.points_max = JSON.parse(exam.points_max);
      }

      resolve(grades);
    });
  });
};
