exports.getGrades = function(db) {
  return (req, res) => {
    const user = req.body.user || null;

    let query = `SELECT * FROM grades`;

    if (user) {
      query = `SELECT * FROM grades WHERE student = ${user.user}`;
    }

    db.query(query, (err, grades) => {
      if (err) {
        return res.send(err);
      }

      if (grades.length === 0) {
        return res.json([]);
      }

      for (const grade of grades) {
        grade.question_ids = JSON.parse(grade.question_ids);
        grade.student_responses = JSON.parse(grade.student_responses);
        grade.instructor_comments = JSON.parse(grade.instructor_comments);
        grade.points_earned = JSON.parse(grade.points_earned);
        grade.points_max = JSON.parse(grade.points_max);
      }

      return res.send(grades);
    });
  };
};
