/**
 * simple-semaphore
 * A modern and simple implementation for semaphore with promise support.
 *
 * @author Phoenix (github.com/azusa0127)
 * @version 2.0.0
 */
const FastQueue = require(`fastqueue`);

/** Semephore class to be exported. */
class Semaphore {
  /**
   * Creates an instance of Semaphore.
   * @param {number} [capacity=1] Initial Semaphore value, should be non-negative.
   */
  constructor(capacity = 1) {
    // Internal semaphore value.
    this._sem = Math.floor(capacity);
    // Internal waiting queue.
    this._queue = new FastQueue();
    // Validate capacity.
    if (typeof capacity !== `number` || this._sem < 0)
      throw new Error(`Invalid Capacity ${capacity}`);

    // Common function alias
    /** @alias Semaphore.wait @see Semaphore.wait */
    this.P = this.wait;
    /** @alias Semaphore.signal @see Semaphore.signal */
    this.V = this.signal;

    /** @alias Semaphore.wait @see Semaphore.wait */
    this.take = this.wait;
    /** @alias Semaphore.signal @see Semaphore.signal */
    this.release = this.signal;
  }

  /**
   * Attempt to acquire/consume semaphore value,
   * @param {number} [n=1] repeated times.
   * @async
   * @returns {Promise<undefined>} promise resolves when passing semaphore condition.
   */
  async wait(n = 1) {
    while (n--)
      await new Promise((resolve, reject) => {
        this._sem > 0 && --this._sem >= 0 ? resolve() : this._queue.push([resolve, reject]);
      });
  }

  /**
   * Resolve waiting promises or increment semaphore value.
   * @param {number} [n=1] repeated times.
   */
  signal(n = 1) {
    while (n--) this._queue.length ? this._queue.shift()[0]() : ++this._sem;
  }

  /** Reject all promises on the waiting queue. */
  rejectAll() {
    while (this._queue.length) this._queue.shift()[1]();
  }
}

module.exports = Semaphore;
