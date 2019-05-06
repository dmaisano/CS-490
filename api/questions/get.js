exports.getQuestions = function(db) {
  return (req, res) => {
    const query = `SELECT * FROM questions ORDER BY question_name`;

    const questionIds = req.body.question_ids;

    if (questionIds) {
      console.log(questionIds);
    }

    const result = [];

    db.query(query, (err, questions) => {
      if (err) {
        return res.send(err);
      }

      if (questions.length === 0) {
        return res.json([]);
      }

      for (const question of questions) {
        question.test_cases = JSON.parse(question.test_cases);
        question.question_constraints = JSON.parse(question.question_constraints);

        if (questionIds && questionIds.length) {
          if (questionIds.includes(question.id)) {
            result.push(question);
          }
        } else {
          result.push(question);
        }
      }

      return res.json(result);
    });
  };
};
