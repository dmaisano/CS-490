exports.addGrade = function(db) {
  return (req, res) => {
    let {
      exam_name,
      student,
      instructor,
      question_ids,
      student_responses,
      instructor_comments,
      points_earned,
      points_max,
    } = req.body;

    const query = `
      INSERT INTO grades VALUES (
        DEFAULT,
        '${exam_name}',
        '${student}',
        '${instructor}',
        ${db.escape(JSON.stringify(question_ids))},
        ${db.escape(JSON.stringify(student_responses))},
        ${db.escape(JSON.stringify(instructor_comments))},
        ${db.escape(JSON.stringify(points_earned))},
        ${db.escape(JSON.stringify(points_max))}
      )
    `;

    db.query(query, err => {
      if (err) {
        console.log(err);
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
