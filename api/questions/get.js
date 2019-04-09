exports.getQuestions = function(db) {
  return (req, res) => {
    db.query(
      `SELECT * FROM questions ORDER BY question_name`,
      (err, result) => {
        if (err) {
          return res.send(err);
        }

        if (result.length === 0) {
          return res.json([]);
        }

        return res.json(result);
      }
    );
  };
};
