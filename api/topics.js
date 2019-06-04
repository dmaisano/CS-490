exports.getTopics = function(db) {
  return async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM topics`);

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
