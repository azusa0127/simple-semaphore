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
   *
   * @async This is an async function and returns an promise.
   * @returns A resolved promise when internal semaphore value is positive or a promise put on the waiting queue that resolves when signal() gets called.
   * @memberof Semaphore
   */
  wait() {
    return this._sem > 0 && --this._sem >= 0
      ? Promise.resolve()
      : new Promise(resolve => this._queue.push(resolve));
  }

  /**
   * Increase internal semaphore value or resolve the first promise in the waiting queue.
   *
   * @memberof Semaphore
   */
  signal() {
    this._queue.length ? this._queue.shift()() : ++this._sem;
  }
}

module.exports = Semaphore;
