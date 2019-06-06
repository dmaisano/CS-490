exports.getGrades = function(db) {
  return async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM grades`);

      for (const item of result) {
        item.exam = JSON.parse(item.exam);
        item.responses = JSON.parse(item.responses);
        item.instructor_comments = JSON.parse(item.instructor_comments);
        item.points = JSON.parse(item.points);
        item.finalized = JSON.parse(item.finalized);
      }

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
