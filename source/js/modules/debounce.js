/*
 let debounce = require('debounce');
 window.onresize = debounce(resize, 200);

 function resize(e) {
 console.log('height', window.innerHeight);
 console.log('width', window.innerWidth);
 }

 To later clear the timer and cancel currently scheduled executions:
 window.onresize.clear();

 */

module.exports = function debounce(func, wait, immediate) {

  function now() {
    return new Date().getTime();
  }

  let timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    let last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  let debounced = function() {
    context = this;
    args = arguments;
    timestamp = now();
    let callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};
