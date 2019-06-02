exports.addQuestion = function(db) {
  return async (req, res) => {
    const {
      question_name,
      function_name,
      question_description,
      difficulty,
      topic,
      test_cases,
    } = req.body;

    try {
      await db.query(
        `INSERT INTO questions (question_name, function_name, question_description, difficulty, topic, test_cases) VALUES (?,?,?,?,?,?)`,
        [
          question_name,
          function_name,
          question_description,
          difficulty,
          topic,
          JSON.stringify(test_cases),
        ]
      );

      return res.json({
        success: true,
        msg: `successfully added question '${question_name}'`,
      });
    } catch (error) {
      return res.json({
        success: false,
        error,
      });
    }
  };
};

exports.getQuestions = function(db) {
  return async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM questions`);

      for (const item of result) {
        item.test_cases = JSON.parse(item.test_cases);
      }

      return res.json(result);
    } catch (error) {
      if (error) {
        console.log({
          error,
        });
      }

      return res.json({
        success: false,
        error,
      });
    }
  };
};
