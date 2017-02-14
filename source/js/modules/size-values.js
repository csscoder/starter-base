/**
 * scrollBarWidth
 * @returns {number}
 */
function scrollBarWidth() {
  let html = document.documentElement;
  let outer = document.createElement('div');
  let inner = document.createElement('div');

  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.overflow = 'scroll';

  outer.appendChild(inner);
  html.appendChild(outer);

  let outerWidth = outer.offsetWidth;
  let innerWidth = inner.offsetWidth;

  html.removeChild(outer);

  return outerWidth - innerWidth;
}

/**
 * Функция получения размера блока()
 * @param {object} element - dom элемент
 * @returns {*[]} возвращает объект Array 0 - width, 1 - height
 */
function getSize(element) {
  let temporary;

  if (element === window || element === document.body) {
    return [window.innerWidth, window.innerHeight];
  }
  if (!element.parentNode) {
    temporary = true;
    document.body.appendChild(element);
  }
  let bounds = element.getBoundingClientRect();
  let styles = getComputedStyle(element);
  let height = (bounds.height | 0)
    + parse(styles.getPropertyValue('margin-top'))
    + parse(styles.getPropertyValue('margin-bottom'));
  let width = (bounds.width | 0)
    + parse(styles.getPropertyValue('margin-left'))
    + parse(styles.getPropertyValue('margin-right'));

  if (temporary) {
    document.body.removeChild(element);
  }

  return [width, height];
}

function parse(prop) {
  return parseFloat(prop) || 0;
}

module.exports = {
  scrollBarWidth: scrollBarWidth,
  getSize: getSize
};


