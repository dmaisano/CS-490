import { AFS_URLS, DEV_URLS, isDev } from './urls.js';

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
 * @param {HTMLElement} elem
 * @returns {void}
 */
export function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

/**
 * navigate to the given hashUrl
 * @param {string} hashUrl
 * @returns {void}
 */
export function navigateUrl(hashUrl = '') {
  if (hashUrl === '') {
    hashUrl = '#/login';
  }

  window.location = hashUrl;
}

export class User {
  constructor(id, pass, type) {
    this.id = id;
    this.pass = pass;
    this.type = type;
  }
}

/**
 * @returns {User|null}
 */
export function getUser() {
  return JSON.parse(localStorage.getItem('user')) || null;
}
