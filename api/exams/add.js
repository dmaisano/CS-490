exports.addExam = function(db) {
  return (req, res) => {
    let { exam_name, instructor, question_ids, points_max } = req.body;

    if (!exam_name || !instructor || !question_ids || !points_max) {
      return res.json({
        error: true,
        msg: 'Missing Field',
      });
    }

    question_ids = JSON.stringify(question_ids);
    points_max = JSON.stringify(points_max);

    const query = `
      INSERT INTO exams VALUES (
        DEFAULT,
        ${db.escape(exam_name)},
        '${instructor}',
        ${db.escape(question_ids)},
        ${db.escape(points_max)}
      )
    `;

    db.query(query, (err) => {
      if (err) {
        return res.json({
          error: true,
          msg: err,
        });
      }

      return res.json({
        success: true,
      });
    });
  };
};
