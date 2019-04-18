exports.addQuestion = function(db) {
  return (req, res) => {
    const {
      question_name,
      function_name,
      question_description,
      difficulty,
      topic,
      question_constraint,
      test_cases,
    } = req.body;

    if (
      !question_name ||
      !function_name ||
      !question_description ||
      !difficulty ||
      !topic ||
      !test_cases
    ) {
      return res.json({
        error: true,
        msg: 'Missing Field',
      });
    }

    console.log(req.body);

    const query = `
      INSERT INTO questions VALUES (
        DEFAULT,
        ${db.escape(question_name)},
        '${function_name}',
        ${db.escape(question_description)},
        '${difficulty}',
        '${topic}',
        '${question_constraint}',
        '${test_cases}'
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
