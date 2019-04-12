exports.addExam = function(db) {
  return (req, res) => {
    let {
      exam_name,
      instructor,
      question_names,
      function_names,
      points,
      test_cases,
    } = req.body;

    if (
      !exam_name ||
      !instructor ||
      !question_names ||
      !function_names ||
      !points ||
      !test_cases
    ) {
      return res.json({
        error: true,
        msg: 'Missing Field',
      });
    }

    question_names = JSON.stringify(question_names);
    function_names = JSON.stringify(function_names);
    points = JSON.stringify(points);
    test_cases = JSON.stringify(test_cases);

    const query = `
      INSERT INTO exams VALUES (
        ${db.escape(exam_name)},
        ${db.escape(instructor)},
        ${db.escape(question_names)},
        ${db.escape(function_names)},
        ${db.escape(points)},
        ${db.escape(test_cases)}
      )
    `;

    db.query(query, err => {
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
