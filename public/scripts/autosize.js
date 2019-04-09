/**
 * auto-resize textarea
 */
export function autosize() {
  let textareas = document.querySelectorAll('textarea');
  const maxHeight = 200; // px

  for (const textarea of textareas) {
    textarea.addEventListener('paste', autoExpand);
    textarea.addEventListener('input', autoExpand);
    textarea.addEventListener('keyup', autoExpand);
  }

  function autoExpand(event, elem) {
    elem = elem || event.target;

    if (elem.scrollHeight >= maxHeight) {
      elem.style.height = `${maxHeight}px`;
    } else {
      elem.style.height = 'inherit';
      elem.style.height = `${elem.scrollHeight}px`;
    }
  }

  window.addEventListener('load', expandAll);
  window.addEventListener('resize', expandAll);

  function expandAll() {
    let textareas = document.querySelectorAll('textarea');

    for (const textarea of textareas) {
      autoExpand(event, textarea);
    }
  }
}
