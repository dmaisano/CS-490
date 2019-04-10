exports.getQuestions = function(db) {
  return (req, res) => {
    const { question_name, difficulty, topic } = req.body;

    let query = `SELECT * FROM questions ORDER BY question_name`;

    if (question_name && !difficulty && !topic) {
      query = `SELECT * FROM questions WHERE question_name = '${question_name}' ORDER BY question_name`;
    } else if (!question_name && difficulty && !topic) {
      query = `SELECT * FROM questions WHERE difficulty = '${difficulty}' ORDER BY question_name`;
    } else if (!question_name && !difficulty && topic) {
      query = `SELECT * FROM questions WHERE topic = '${topic}' ORDER BY question_name`;
    } else if (question_name && difficulty && !topic) {
      query = `SELECT * FROM questions WHERE question_name = '${question_name}' AND difficulty = '${difficulty}' ORDER BY question_name`;
    } else if (question_name && !difficulty && topic) {
      query = `SELECT * FROM questions WHERE question_name = '${question_name}' AND topic = '${topic}' ORDER BY question_name`;
    } else if (!question_name && difficulty && topic) {
      query = `SELECT * FROM questions WHERE difficulty = '${difficulty}' AND topic = '${topic}' ORDER BY question_name`;
    } else if (question_name && difficulty && topic) {
      query = `SELECT * FROM questions WHERE question_name = '${question_name}' AND difficulty = '${difficulty}' AND topic = '${topic}' ORDER BY question_name`;
    }

    // console.log({
    //   query,
    //   question_name,
    //   difficulty,
    //   topic,
    // });

    db.query(query, (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length === 0) {
        return res.json([]);
      }

      return res.json(result);
    });
  };
};
