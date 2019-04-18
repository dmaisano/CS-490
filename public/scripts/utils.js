/**
 * helper function to convert question names to ids and vice-versa
 * @param {string} question_name
 * @param {string} 'id' or 'name'
 * @returns {string}
 */
export function convertQuestion(question_name, type) {
  if (type === 'id') {
    return question_name.split(' ').join('-');
  } else if (type === 'name') {
    return question_name.split('-').join(' ');
  }

  return '';
}

/**
 * returns true if question exists
 * @param {string} question_name
 * @param {string} query
 * @returns {boolean}
 */
function isAssigned(question_name, query) {
  if (!question_name || !query) return false;

  const questions = document.querySelectorAll(query);

  for (const question of questions) {
    if (question.getAttribute('id') === question_name) {
      return true;
    }
  }

  return false;
}
