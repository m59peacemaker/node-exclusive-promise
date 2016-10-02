const Promise = require('bluebird')

Promise.config({
  cancellation: true
})

// consumer must use bluebird Promises!

const exclusivePromise = fn => {
  let currentPromise
  return (...args) => {
    currentPromise && currentPromise.cancel()
    currentPromise = fn(...args)
    if (typeof currentPromise.then !== 'function') {
      throw new TypeError(`"fn" must return a promise`)
    }
    return currentPromise
  }
}

module.exports = exclusivePromise
