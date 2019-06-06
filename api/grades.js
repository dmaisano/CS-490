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

    let finalized = 0;

    try {
      await db.query(
        `INSERT INTO grades (exam, student_id, responses, instructor_comments, points, points_earned, finalized) VALUES (?,?,?,?,?,?,?)`,
        [
          JSON.stringify(exam),
          student_id,
          JSON.stringify(responses),
          JSON.stringify(instructor_comments),
          JSON.stringify(points),
          JSON.stringify(points_earned),
          finalized,
        ]
      );

      console.log(JSON.parse(req.body));

      return res.json({
        success: true,
        msg: `successfully added grade`,
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

      for (const item of result) {
        item.exam = JSON.parse(item.exam);
        item.responses = JSON.parse(item.responses);
        item.instructor_comments = JSON.parse(item.instructor_comments);
        item.points = JSON.parse(item.points);
        item.points_earned = JSON.parse(item.points_earned);
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
