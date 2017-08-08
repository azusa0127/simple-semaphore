# simple-semaphore
Simple semaphore implementation with promise support.

## Install
```
npm i simple-semaphore
```

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
   *
   * @async This is an async function and returns an promise.
   * @returns A resolved promise when internal semaphore value is positive or a promise put on the waiting queue that resolves when signal() gets called.
   * @memberof Semaphore
   */
  async wait();
  async take(); // Alias for this.wait().
  async P(); // Alias for this.wait().

  /**
   * Increase internal semaphore value or resolve the first promise in the waiting queue.
   *
   * @memberof Semaphore
   */
  signal();
  release(); // Alias for this.signal().
  V(); // Alias for this.signal().
}

module.exports = Semaphore;
```

## Example
See a full classic Producer-Consumer example in [`example.js`](/master/example.js)

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
  sem_notEmpty.signal();
});

const consume = () => sem_notEmpty.wait().then(()=>{
  // produce...
  sem_notFull.signal();
});
```

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
