exports.getStudents = function(db) {
  return async (req, res) => {
    try {
      const result = await db.query(
        `SELECT * FROM users WHERE type = 'student'`
      );

      return res.json(result);
    } catch (error) {
      if (error) {
        console.error({
          error,
        });
      }

      return res.json({
        success: false,
        error,
      });
    }
  };
};
