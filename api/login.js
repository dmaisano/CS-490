exports.login = function(db) {
  return async (req, res, next) => {
    const { user, pass } = req.body;

    try {
      const result = await db.query(`SELECT * FROM users WHERE id = ?`, [user]);

      if (result[0].pass !== pass) {
        return res.json({
          success: false,
          message: 'incorrect password',
        });
      }

      return res.json({
        user,
        type: result[0].type,
      });
    } catch (error) {
      return res.json({
        error,
      });
    }
  };
};
