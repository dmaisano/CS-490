exports.getTopics = function(db) {
  return (req, res) => {
    db.query(`SELECT * FROM topics ORDER BY topic`, (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length === 0) {
        return res.sendStatus(403);
      }

      let topics = [];

      for (const item of result) {
        topics.push(item['topic']);
      }

      return res.json(topics);
    });
  };
};
