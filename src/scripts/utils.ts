export function createElem({
  type,
  id,
  className,
  attributes,
  innerHTML,
}: {
  type?: string;
  id?: string;
  className?: string;
  attributes?: {
    attribute: string;
    data: string;
  }[];
  innerHTML?: string;
}): HTMLElement {
  const elem = document.createElement(type === null ? 'div' : type);

  if (id) {
    elem.setAttribute('id', id);
  }

  if (className) {
    elem.setAttribute('class', className);
  }

  if (attributes && attributes.length) {
    for (const obj of attributes) {
      elem.setAttribute(obj.attribute, obj.data);
    }
  }

  if (innerHTML) {
    elem.innerHTML = innerHTML;
  }

  return elem;
}
