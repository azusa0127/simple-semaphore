const Semaphore = require(`./index`);
const assert = require(`assert`);

const stock = {
  items: 0,
  notfull: new Semaphore(10),
  notempty: new Semaphore(0),
};

class Producer {
  constructor(iterations) {
    this.iterations = iterations;
  }

  static async produce() {
    await stock.notfull.wait();
    assert(++stock.items <= 10, `Stock overflowed! ${stock.items}`);
    console.log(`Stock after produce: ${stock.items}`);
    stock.notempty.signal();
  }

  async work() {
    while (this.iterations--) await Producer.produce();
  }
}

class Consumer {
  constructor(iterations) {
    this.iterations = iterations;
  }

  static async consume() {
    await stock.notempty.wait();
    assert(--stock.items >= 0, `Stock underflowed! ${stock.items}`);
    console.log(`Stock after consume: ${stock.items}`);
    stock.notfull.signal();
  }

  async work() {
    while (this.iterations--) await Consumer.consume();
  }
}

async function main() {
  const workers = [
    new Producer(100),
    new Producer(100),
    new Producer(100),
    new Producer(100),
    new Producer(100),
    new Consumer(200),
    new Consumer(300),
  ];
  return await Promise.all(workers.map(x => x.work()));
}

main().then(() => console.log(`Done!`), err => console.error(err));
