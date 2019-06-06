exports.addExam = function(db) {
  return async (req, res) => {
    let { exam_name, questions, points } = req.body;

    try {
      await db.query(
        `INSERT INTO exams (exam_name, questions, points) VALUES (?,?,?)`,
        [exam_name, JSON.stringify(questions), JSON.stringify(points)]
      );

      return res.json({
        success: true,
        msg: `successfully added exam '${exam_name}'`,
      });
    } catch (error) {
      console.log({
        error,
      });

      return res.json({
        success: false,
        error,
      });
    }
  };
};

exports.getExams = function(db) {
  return async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM exams`);

      for (const item of result) {
        item.questions = JSON.parse(item.questions);
        item.points = JSON.parse(item.points);
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
