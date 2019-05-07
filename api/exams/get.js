exports.getExams = function(db) {
  return (req, res) => {
    const userType = req.body.type || '';

    if (!userType) {
      res.status(403);
      return res.json({
        error: true,
        message: 'Not Auth',
      });
    }

    let query = `SELECT * FROM exams`;

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
      }

      return res.send(exams);
    });
  };
};
