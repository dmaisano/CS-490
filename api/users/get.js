exports.getStudents = function(db) {
  return (req, res) => {
    const { type } = req.body;

    if (type === undefined || type !== 'instructor') {
      return res.json({
        error: true,
        msg: 'Not Auth',
      });
    }

    db.query(`SELECT * FROM users WHERE type = 'student'`, (err, users) => {
      if (err) {
        return res.send(err);
      }

      if (users.length === 0) {
        return res.json([]);
      }

      for (const user of users) {
        user.pass = undefined;
      }

      return res.json(users);
    });
  };
};
