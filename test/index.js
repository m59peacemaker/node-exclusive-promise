const test = require('tape')
const Promise = require('bluebird')
const exclusivePromise = require('../')

test('arguments pass through', t => {
  t.plan(1)
  const fn = (a) => new Promise((resolve, reject) => {
    resolve(a)
  }).then(v => t.equal(v, 123))
  const exclusiveFn = exclusivePromise(fn)
  exclusiveFn(123)
})

test('cancels old promise', t => {
  t.plan(1)
  let chainWasNotCanceled = false
  const fn = (value) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 100)
    }).then(() => {
      if (value === false) {
        chainWasNotCanceled = true
      } else {
        chainWasNotCanceled ? t.fail('chain was not canceled') : t.pass('chain was canceled')
      }
    })
  }
  const exclusiveFn = exclusivePromise(fn)
  exclusiveFn(false)
  exclusiveFn(true)
})

test('returns new promise', t => {
  t.plan(3)
  const fn = () => new Promise(resolve => resolve())
  const exclusiveFn = exclusivePromise(fn)
  const a = exclusiveFn()
  const b = exclusiveFn()
  t.equal(typeof a.then, 'function', 'return value is a promise')
  t.equal(typeof b.then, 'function', 'return value is a promise')
  t.false(a === b, 'a different promise was returned on the next call')
})

test('throws if "fn" does not return a promise', t => {
  t.plan(1)
  const fn = () => 123
  const exclusiveFn = exclusivePromise(fn)
  let threw = false
  try {
    const a = exclusiveFn()
  } catch(err) {
    threw = true
  }
  if (threw) {
    t.pass('threw error when "fn" returned a number')
  } else {
    t.fail('did not throw error when "fn" returned a number')
  }
})
