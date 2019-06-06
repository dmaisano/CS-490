exports.addGrade = function(db) {
  return async (req, res) => {
    const {
      exam,
      student_id,
      responses,
      instructor_comments,
      points,
      points_earned,
    } = req.body;

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

exports.getGrades = function(db) {
  return async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM grades`);

      // for (const item of result) {
      //   item.questions = JSON.parse(item.questions);
      //   item.points = JSON.parse(item.points);
      // }

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
