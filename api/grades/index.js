const { grader } = require('./grader');
const { getGrades } = require('./get');
const { addGrade } = require('./add');
const { updateGrade } = require('./update');

module.exports = {
  grader,
  getGrades,
  addGrade,
  updateGrade,
};
