# simple-semaphore
Simple semaphore implementation with promise support.

## Install
```bash
npm install simple-semaphore
```

## Requirement

`NodeJS 7.6.0+` as async/await feature is used.

## API
```javascript
class Semaphore {
  /**
   * Creates an instance of Semaphore.
   * @param {number} [capacity=1] Initial Semaphore value, should be non-negative.
   */
  constructor(capacity = 1) {}

  /**
   * Attempt to acquire/consume semaphore value,
   * @param {number} [n=1] repeated times.
   * @async
   * @returns {Promise<undefined>} promise resolves when passing semaphore condition.
   */
  async wait(n = 1) {}
  async take(n = 1) {} /** @alias Semaphore.wait */
  async P(n = 1) {} /** @alias Semaphore.wait */

  /**
   * Resolve waiting promises or increment semaphore value.
   * @param {number} [n=1] repeated times.
   */
  signal(n = 1) {}
  release(n = 1) {} /** @alias Semaphore.signal */
  V(n = 1) {} /** @alias Semaphore.signal */

  /** Reject all promises on the waiting queue. */
  rejectAll() {}
}

module.exports = Semaphore;
```

## Example
See a full classic Producer-Consumer example in [`example.js`](/example.js)

### Require and Initialize
```javascript
const Semaphore = require(`simple-semaphore`);

const sem_notFull = new Semaphore(10),
  sem_notEmpty = new Semaphore(0);
```
### Async/Await Style.
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
### Promise Style.
```javascript
const produce = () => sem_notFull.wait(10).then(()=>{ // Wait 10 times before resolve.
  // produce...
  sem_notEmpty.signal(10); // Signals 10 times instantly.
});

const consume = () => sem_notEmpty.wait().then(()=>{
  // produce...
  sem_notFull.signal();
});
```
### Advanced hacks
```javascript
sem_notFull._sem // check the internal semaphore value
sem_notFull._queue.length // check the internal waiting queue length
sem_notFull.rejectAll() // reject and remove all promises from the waiting queue.
```
## Changelog
2.0.1 / 2017-08-10
  * (Bugfix) Added rejection error messge.

2.0.0 / 2017-08-10
  * (Perfomance) Up to 10x faster by switching waiting queue to [fastqueue](https://www.npmjs.com/package/fastqueue).
  + (New API) `rejectAll()` - Now the `_queue` stores both `[resolve, reject]` function references for every waiting promise. So promise from `wait()` may now reject if `rejectAll()` called.
  * (JSDoc) Style improvement.

1.1.0 / 2017-08-07
  * Added param `n` to `signal()` and `wait()` for batch semaphore operation.

1.0.0 / Initial Release.

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
