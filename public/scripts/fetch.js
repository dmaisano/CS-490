/**
 * send a POST request using window.fetch
 * @param {string} url
 * @param {Object} data
 */
export function postObj(url, data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch(err => {
    console.log('FETCH error');
    console.error(err);
  });
}
