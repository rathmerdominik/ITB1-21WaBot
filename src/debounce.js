/**
 * This function debounces another function
 *
 * @param fn function to be called after debounce time has been met
 * @param ms ms to debounce for
 */
 export default (fn, ms = 0) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };