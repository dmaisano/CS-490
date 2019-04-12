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

      const data = [];

      for (const exam of result) {
        const question_names = JSON.parse(exam.question_names);
        const function_names = JSON.parse(exam.function_names);
        const points = JSON.parse(exam.points);
        const test_cases = JSON.parse(exam.test_cases);

        data.push({
          exam_name: exam.exam_name,
          instructor: exam.instructor,
          question_names,
          function_names,
          points,
          test_cases,
        });
      }

      return res.send(data);
    });
  };
};
