# exclusive-promise

Use this when you have a function that returns a promise and you want that promise to be canceled if the function is called again.

*\* Native promises don't support cancellation, so you must use bluebird `Promise`*

## install

```sh
npm install exclusive-promise bluebird
```

## example

```js
const Promise = require('bluebird')
const exclusivePromise = require('exclusive-promise')

const fn = () => {
  return new Promise((resolve, reject) => {

  }).then(() => {
    // in this example, "a" will be canceled and will not reach this point
    // "b" will reach this point
  })
}
const exclusiveFn = exclusivePromise(fn)
const a = exclusiveFn() // promise chain "a" begins
const b = exclusiveFn() // promise chain "a" is canceled, "b" begins
```

## API

### exclusivePromise(fn)

- `fn: function` a function that creates and returns a promise
- **returns**: `function` a function that calls `fn` after canceling the promise from the previous call. Arguments are passed through to `fn`.
