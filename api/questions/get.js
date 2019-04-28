exports.getQuestions = function(db) {
  return (req, res) => {
    const query = `SELECT * FROM questions ORDER BY question_name`;

    db.query(query, (err, questions) => {
      if (err) {
        return res.send(err);
      }

      if (questions.length === 0) {
        return res.json([]);
      }

      const result = [];

      for (const question of questions) {
        question.test_cases = JSON.parse(question.test_cases);

        result.push(question);
      }

      return res.json(result);
    });
  };
};
