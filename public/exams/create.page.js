/**
 * @returns {string}
 */
export function CREATE_EXAM_PAGE() {
  return /*html*/ `
  <div class="split">
    <div id="question-bank"></div>

    <div class="new-exam">
      <h1 class="title">Create Exam</h1>

      <div class="form-group exam-name">
        <label>Exam Name</label>
        <input type="text" id="exam-name" placeholder="Enter exam name" required />
      </div>

      <h2 class="title">Exam Questions</h2>

      <div id="exam-box">

      </div>
    </div>
  </div>
`;
}
