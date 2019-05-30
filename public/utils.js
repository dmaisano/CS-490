/**
 *
 * @param {RequestInfo} url
 * @param {object} data
 */
export function postRequest(url, data = {}) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch(err => {
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
