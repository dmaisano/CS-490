// grades and adds a student's exam to the DB
exports.grader = function(db) {
  return (req, res) => {
    // const user = req.body.user || null;

    const { user } = req.body;

    return res.json({
      success: true,
    });
  };
};
