import { isDev, DEV_URLS, URLS, AFS_URLS } from './urls';

/**
 * sends a post request
 * @param {string} urlKey key used to access the url-endpoint based on the current environment
 * @param {object} data
 * @returns {Promise}
 */
export function postRequest(urlKey, data = {}) {
  let postUrl = DEV_URLS[urlKey];

  if (!isDev) {
    postUrl = 'https://web.njit.edu/~dm583/490/public/curl.php';
    data.url = AFS_URLS[urlKey]; // points to Lawrence's php page based on the urlKey
  }

  return fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .catch(err => {
      console.error(`fetch error`);
      console.error(err);
    });
}
/**
 * @returns {HTMLElement} elem
 */
export function createElem(options) {
  const { type, id, className, attributes, innerHTML } = options;

  const elem = document.createElement(type === null ? 'div' : type);

  if (id) {
    elem.setAttribute('id', options.id);
  }

  if (className) {
    elem.setAttribute('class', options.className);
  }

  if (attributes && options.attributes.length) {
    for (const obj of options.attributes) {
      elem.setAttribute(obj.attribute, obj.data);
    }
  }

  if (innerHTML) {
    elem.innerHTML = options.innerHTML;
  }

  return elem;
}

/**
 *
 * @param {HTMLElement} elem
 */
export function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}
