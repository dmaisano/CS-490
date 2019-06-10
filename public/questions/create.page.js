/**
 * @returns {string}
 */
export function CREATE_QUESTION_PAGE() {
  return /*html*/ `
  <div class="split">
    <div class="new-question">
      <h1 class="title">Create Question</h1>

      <div class="form">
        <div class="input">
          <div class="form-group">
            <label>Question Name</label>
            <input type="text" id="question-name" placeholder="Enter question name" required />
          </div>

          <div class="form-group">
            <label>Function Name</label>
            <input type="text" id="function-name" placeholder="Enter function name" required />
          </div>
        </div>

        <div class="select">
          <div class="custom-select">
            <select id="topics">
              <option value="">Topic</option>
              <option value="Dict">Dict</option>
              <option value="Functions">Functions</option>
              <option value="If">If</option>
              <option value="Lists">Lists</option>
              <option value="Loops">Loops</option>
              <option value="Math">Math</option>
              <option value="Strings">Strings</option>
            </select>

            <div>▼</div>
          </div>

          <div class="custom-select">
            <select id="difficulty">
              <option value="">Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <div>▼</div>
          </div>

          <!-- constraints go here -->
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea id="description" rows="5" placeholder="Enter question description"></textarea>
          </div>

        <h2 class="title">Test Cases</h2>

        <div id="test-cases">
          <div class="test-case">
            <input type="text" placeholder="Args" required />
            <input type="text" placeholder="Output" required />
            <button type="button" class="btn" disabled>
              X
            </button>
          </div>
          <div class="test-case">
            <input type="text" placeholder="Args" required />
            <input type="text" placeholder="Output" required />
            <button type="button" class="btn" disabled>
              X
            </button>
          </div>
        </div>

        <div class="form-buttons">
          <button type="button" id="add-test-case" class="btn btn-success">Add Test Case</button>
          <button type="button" id="create-question" class="btn btn-success">Create Question</button>
        </div>
      </div>
    </div>

    <div id="question-bank"></div>
  </div>
`;
}
