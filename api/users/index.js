// collection of all the user functions

exports.getUser = function(db) {
  return (req, res) => {
    let user = req.body.user;
    const pass = req.body.pass;

    db.query(
      `SELECT * FROM users where user = '${user}' AND pass = '${pass}'`,
      (err, result) => {
        if (err) {
          return res.send(err);
        }

        if (result.length === 0) {
          return res.sendStatus(403);
        }

        let { user, type } = result[0];

        return res.json({
          user,
          type,
        });
      }
    );
  };
};
