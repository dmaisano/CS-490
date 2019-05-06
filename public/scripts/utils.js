/**
 * helper function to a name to valid id and vice-versa
 * @param {string} name
 * @param {string} type name or id
 * @returns {string}
 */
export function convertName(name, type) {
  if (type === 'id') {
    return name.split(' ').join('-');
  } else if (type === 'name') {
    return name.split('-').join(' ');
  }

  return '';
}

/**
 * returns the user object
 */
export function getUser() {
  return JSON.parse(localStorage.getItem('user')) || false;
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
