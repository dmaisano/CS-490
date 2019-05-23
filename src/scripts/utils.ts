/**
 * send a POST request
 * @param url request url
 * @param data data object
 */
export function postRequest(url: RequestInfo, data: object = {}): Promise<any> {
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
 * creates and returns a new HTML element
 * @param options config object
 */
export function createElem(options: {
  type?: string;
  id?: string;
  className?: string;
  attributes?: {
    attribute: string;
    data: string;
  }[];
  innerHTML?: string;
}): HTMLElement {
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
 * removes any children elems attached to the root elem
 * @param AppRoot root element of the app
 */
export function cleanRoot(
  AppRoot: HTMLDivElement = document.querySelector('body #root')
): void {
  while (AppRoot.firstChild) {
    AppRoot.removeChild(AppRoot.firstChild);
  }
}
