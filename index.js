/**
 * simple-semaphore
 * A modern and simple implementation for semaphore with promise support.
 *
 * @author Phoenix (github.com/azusa0127)
 * @version 1.1.0
 */

/**
 * Semephore class with wait() in promise.
 *
 * @class Semaphore
 */
class Semaphore {
  /**
   * Creates an instance of Semaphore.
   * @param {number} [capacity=1] Initial Semaphore value, should be non-negative.
   * @memberof Semaphore
   */
  constructor(capacity = 1) {
    // Internal semaphore value.
    this._sem = Math.floor(capacity);
    // Internal waiting queue.
    this._queue = [];
    // Validate capacity.
    if (typeof capacity !== `number` || this._sem < 0)
      throw new Error(`Invalid Capacity ${capacity}`);

    // Common function alias
    this.P = this.wait;
    this.V = this.signal;

    this.take = this.wait;
    this.release = this.signal;
  }

  /**
   * Attempt to acquire or consume a semaphore value,
   * @async This is an async function and returns a promise.
   *
   * @param {number} [n=1] number of times to wait until the Promise resolves.
   * @returns A resolved promise when internal semaphore value is positive or a promise put on the waiting queue that resolves when signal() gets called.
   * @memberof Semaphore
   */
  async wait(n = 1) {
    while (n--) {
      await new Promise(resolve => {
        this._sem > 0 && --this._sem >= 0 ? resolve() : this._queue.push(resolve);
      });
    }
  }

  /**
   * Increase internal semaphore value or resolve the first promises in the waiting queue.
   *
   * @param {number} [n=1] number of times to increase internal semaphore value or resolve waiting queue promises.
   * @memberof Semaphore
   */
  signal(n = 1) {
    while (n--) this._queue.length ? this._queue.shift()() : ++this._sem;
  }
}

module.exports = Semaphore;
