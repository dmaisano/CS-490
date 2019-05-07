exports.getGrades = function(db) {
  return async (req, res) => {
    const { user, type } = req.body;

    if (user === undefined || type === undefined) {
      res.status(403);
      return res.json({
        error: true,
        message: 'Not Auth',
      });
    }

    let query = `SELECT * FROM grades`;

    if (type === 'student') {
      query = `SELECT * FROM grades WHERE student = '${user}'`;
    }

    db.query(query, (err, grades) => {
      if (err) {
        return res.send(err);
      }

      if (grades.length === 0) {
        return res.json([]);
      }

      for (const grade of grades) {
        grade.question_ids = JSON.parse(grade.question_ids);
        grade.student_responses = JSON.parse(grade.student_responses);
        grade.instructor_comments = JSON.parse(grade.instructor_comments);
        grade.points_earned = JSON.parse(grade.points_earned);
        grade.points_max = JSON.parse(grade.points_max);
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
