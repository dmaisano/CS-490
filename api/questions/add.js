exports.addQuestion = function(db) {
  return (req, res) => {
    const {
      question_name,
      function_name,
      question_description,
      difficulty,
      topic,
    } = req.body;

    if (
      !function_name ||
      !question_name ||
      !question_description ||
      !difficulty ||
      !topic
    ) {
      return res.json({
        error: true,
        msg: 'Missing Field',
      });
    }

    const query = `
      INSERT INTO questions VALUES (
        ${db.escape(question_name)},
        ${db.escape(function_name)},
        ${db.escape(question_description)},
        ${db.escape(difficulty)},
        ${db.escape(topic)},
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
