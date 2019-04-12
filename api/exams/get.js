exports.getExams = function(db) {
  return (req, res) => {
    const query = `SELECT * FROM exams`;

    db.query(query, (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length === 0) {
        return res.json([]);
      }

      result = result[0];

      const question_names = JSON.parse(result.question_names);
      const function_names = JSON.parse(result.function_names);
      const points = JSON.parse(result.points);
      const test_cases = JSON.parse(result.test_cases);

      const data = {
        exam_name: result.exam_name,
        instructor: result.instructor,
        question_names,
        function_names,
        points,
        test_cases,
      };

      return res.send(data);
    });
  };
};
