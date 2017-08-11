/**
 * An classic Producer-Consumer example with simple-semaphore
 *
 * @author Phoenix (github.com/azusa0127)
 */
const Semaphore = require(`./index`);
const assert = require(`assert`);

// A shared stock that can have 0 to 10 items.
const stock = {
  items: 0,
  notfull: new Semaphore(10),
  notempty: new Semaphore(0),
};

// A classic producer that produces 1 item at a time.
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

// A classic consumer that consumes 1 item at a time.
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

// An efficient producer that produces 10 item at a time and only produces when stock gets empty.
class EfficientProducer extends Producer {
  static async produce() {
    await stock.notfull.wait(10);
    stock.items += 10;
    assert(stock.items <= 10, `Stock overflowed! ${stock.items}`);
    console.log(`Stock after effective produce: ${stock.items}`);
    stock.notempty.signal(10);
  }

  async work() {
    while (this.iterations--) await EfficientProducer.produce();
  }
}

// Async wrapped main function.
async function main() {
  console.log(`\n\n[Single step producer]`);
  const workers1 = [
    new Producer(100),
    new Producer(100),
    new Producer(100),
    new Producer(100),
    new Producer(100),
    new Consumer(200),
    new Consumer(300),
  ];
  await Promise.all(workers1.map(x => x.work()));

  console.log(`\n\n[Efficient producer]`);
  const workers2 = [
    new EfficientProducer(10),
    new Consumer(10),
    new Consumer(10),
    new Consumer(10),
    new Consumer(10),
    new Consumer(10),
    new Consumer(10),
    new Consumer(20),
    new Consumer(20),
  ];
  await Promise.all(workers2.map(x => x.work()));

  console.log(`\n\n[RejectAll() API test]`);
  const p = new Consumer(1).work();
  stock.notempty.rejectAll();
  p.then(
    () => console.error(`[ERROR] This promise should not resolve.`),
    () => console.log(`Successful.`),
  );
}

// Invocation of main function.
main().then(() => console.log(`Done!`), err => console.error(err));
