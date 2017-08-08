# simple-semaphore
Simple semaphore implementation with promise support.

## Install
```
npm i simple-semaphore
```

## Requirement

`NodeJS 7.6.0+` as async/await feature is used.

## API
```javascript
class Semaphore {
  /**
   * Creates an instance of Semaphore.
   * @param {number} [capacity=1] Initial Semaphore value, should be non-negative.
   * @memberof Semaphore
   */
  constructor(capacity = 1){};

  /**
   * Attempt to acquire or consume a semaphore value,
   * @async This is an async function and returns an promise.
   *
   * @param {number} [n=1] number of times to consume internal semaphore value or wait in the queue until resolve.
   * @returns A resolved promise when internal semaphore value is positive or a promise put on the waiting queue that resolves when signal() gets called.
   * @memberof Semaphore
   */
  async wait(n = 1);
  async take(n = 1); // Alias for this.wait().
  async P(n = 1); // Alias for this.wait().

  /**
   * Increase internal semaphore value or resolve the first promises in the waiting queue.
   *
   * @param {number} [n=1] number of times to increase internal semaphore value or resolve waiting queue promises.
   * @memberof Semaphore
   */
  signal(n = 1);
  release(n = 1); // Alias for this.signal().
  V(n = 1); // Alias for this.signal().
}

module.exports = Semaphore;
```

## Example
See a full classic Producer-Consumer example in [`example.js`](/example.js)

Require
```javascript
const Semaphore = require(`simple-semaphore`);
```
Initiliaze
```javascript
const sem_notFull = new Semaphore(10),
  sem_notEmpty = new Semaphore(0);
```
Async/Await Style.
```javascript
const produce = async () {
  await sem_notFull.wait();
  // produce...
  sem_notEmpty.signal();
};

const consume = async () {
  await sem_notEmpty.wait();
  // produce...
  sem_notFull.signal();
};
```
Promise Style.
```javascript
const produce = () => sem_notFull.wait().then(()=>{
  // produce...
  sem_notEmpty.signal(10); // Signals 10 times instantly.
});

const consume = () => sem_notEmpty.wait().then(()=>{
  // produce...
  sem_notFull.signal();
});
```
## Changelog
1.1.0 / 2017-08-07
  * Added param `n` to `signal()` and `wait()` for batch semaphore operation.

1.0.0 / Initial Release.

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
