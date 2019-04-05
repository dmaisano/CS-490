/**
 * send a POST request using window.fetch
 * @param {string} url
 * @param {Object} obj
 */
export function postObj(url, obj = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  }).catch(err => {
    console.log('FETCH error');
    console.error(err);
  });
}
