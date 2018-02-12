/**
 * simple-semaphore
 * A fast implementation for semaphore with promise support.
 *
 * @author Phoenix (github.com/azusa0127)
 * @version 2.1.0
 */
const FastQueue = require(`fastqueue`);

/** Semephore class to be exported. */
class Semaphore {
  /**
   * Creates an instance of Semaphore.
   * @param {number} [capacity=1] - Initial Semaphore value, should be non-negative.
   */
  constructor (capacity = 1) {
    // Internal semaphore value.
    this._sem = Math.trunc(capacity);
    // Internal waiting queue.
    this._queue = new FastQueue();
    // Validate capacity.
    if (typeof capacity !== `number` || this._sem < 0) {
      throw new Error(`Invalid Capacity ${capacity}`);
    }

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
   * @async
   * @param {number} [n=1] - Wait cycles.
   * @returns {Promise<void>} - The promise resolves when semaphore condition passes.
   */
  wait (n = 1) {
    const recHelper = () => {
      if (!n) return Promise.resolve();
      --n;
      return this._sem > 0 && --this._sem >= 0
        ? recHelper()
        : new Promise((resolve, reject) => this._queue.push([resolve, reject])).then(recHelper);
    };
    return recHelper();
  }

  /**
   * Resolve waiting promises or increment semaphore value.
   * @param {number} [n=1] - Signal times.
   */
  signal (n = 1) {
    while (n--) this._queue.length ? this._queue.shift()[0]() : ++this._sem;
  }

  /** Reject all promises on the waiting queue. */
  rejectAll () {
    while (this._queue.length) {
      this._queue.shift()[1](new Error(`[Semaphore] Task cancled as rejectAll() gets called.`));
    }
  }
}

module.exports = Semaphore;
