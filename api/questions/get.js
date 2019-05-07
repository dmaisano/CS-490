exports.getQuestions = function(db) {
  return (req, res) => {
    const query = `SELECT * FROM questions ORDER BY question_name`;

    const questionIds = req.body.question_ids;

    const data = [];

    db.query(query, (err, questions) => {
      if (err) {
        return res.send(err);
      }

      if (questions.length === 0) {
        return res.json([]);
      }

      // this is really bad for time complexity
      // but we don't care :')
      if (questionIds && questionIds.length) {
        for (const id of questionIds) {
          for (const question of questions) {
            if (question.id !== id) continue;

            question.test_cases = JSON.parse(question.test_cases);
            question.question_constraints = JSON.parse(
              question.question_constraints
            );

            data.push(question);
          }
        }
      } else {
        for (const question of questions) {
          question.test_cases = JSON.parse(question.test_cases);
          question.question_constraints = JSON.parse(
            question.question_constraints
          );

          data.push(question);
        }
      }

      return res.json(data);
    });
  };
};
