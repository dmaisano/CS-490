const { getStudentGrades } = require('../grades/get');

exports.getExams = function(db) {
  return async (req, res) => {
    const { user, type } = req.body;

    if (type === undefined) {
      res.status(403);
      return res.json({
        error: true,
        message: 'Not Auth',
      });
    }

    let query = `SELECT * FROM exams`;

    let takenExams = false;

    if (type === 'student') {
      takenExams = await getStudentGrades(db, user);
    }

    const data = [];

    db.query(query, (err, exams) => {
      if (err) {
        return res.send(err);
      }

      if (exams.length === 0) {
        return res.json([]);
      }

      for (const exam of exams) {
        exam.question_ids = JSON.parse(exam.question_ids);
        exam.points_max = JSON.parse(exam.points_max);

        if (type === 'student') {
          for (const takenExam of takenExams) {
            if (exam.exam_name === takenExam.exam_name) {
              data.push(exam);
            }
          }
        } else {
          data.push(exam);
        }
      }

      return res.send(data);
    });
  };
};
