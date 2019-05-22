/**
 * Creates and returns a new HTML element
 *
 * @param options object that contains the function args
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
 * Removes any children elems attached to the root elem
 *
 * @param AppRoot The root element of the app
 */
export function cleanRoot(
  AppRoot: HTMLDivElement = document.querySelector('body #root')
): void {
  while (AppRoot.firstChild) {
    AppRoot.removeChild(AppRoot.firstChild);
  }
}
