exports.addQuestion = function(db) {
  return (req, res) => {
    const name = req.body.name || '';
    const functionName = req.body.functionName || '';
    const topic = req.body.topic || '';
    const difficulty = req.body.difficulty || '';
    const description = req.body.description || '';

    db.query(
      `INSERT INTO questions VALUES (DEFAULT, "${difficulty}", "${topic}", "${name}", "${functionName}", "${description}")`,
      (err, result) => {
        if (err) {
          return res.json({
            error: true,
            msg: err,
          });
        }

        return res.json({
          success: true,
        });
      }
    );
  };
};
