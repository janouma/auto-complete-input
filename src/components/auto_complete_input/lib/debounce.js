export default function debounce (fn, delay) {
  if (typeof fn !== 'function') {
    throw new Error('fn argument must be a function. Actual: ' + fn)
  }

  if (typeof delay !== 'number') {
    throw new Error('delay argument must be a number. Actual: ' + delay)
  }

  const { setTimeout, clearTimeout } = globalThis
  let timeoutId

  return function debouncedFn (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(function delayedFn () { fn(...args) }, delay)
  }
}
