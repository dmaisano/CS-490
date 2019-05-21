export interface createElemOptions {
  type?: string;
  id?: string;
  className?: string;
  attributes?: {
    attribute: string;
    data: string;
  }[];
  innerHTML?: string;
}

/**
 * Creates and returns a new HTML element
 *
 * @param options options / config object
 */
export function createElem(options: createElemOptions): HTMLElement {
  const elem = document.createElement(
    options.type === null ? 'div' : options.type
  );

  if (options.id) {
    elem.setAttribute('id', options.id);
  }

  if (options.className) {
    elem.setAttribute('class', options.className);
  }

  if (options.attributes && options.attributes.length) {
    for (const obj of options.attributes) {
      elem.setAttribute(obj.attribute, obj.data);
    }
  }

  if (options.innerHTML) {
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
