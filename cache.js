/*
---- EXCERCISE:
 Given a javascript function that takes a long time to compute, 
 with two arguments (arg1 and arg2, both of them strings ), please 
 write a cache that's able to improve the performance of any given user of
 the long running function. The cache should have a configurable amount of
 values and should use a fifo algorithm to replace entries.

 * Readers notes:
    There are some simple tests at the end of the file.
    The cache is provided as a class for portability.
    A "time consuming function" is provided for the tests (with random return so it
       is easier to check when cache is working). 
 */

// ------ IMPLEMENTATION ------

function aVeryTimeConsumingFunction(arg1, arg2) {
  return Math.random();
}

class CustomCache {
  #elements;
  #size;
  #cursor;
  #lookUpTable;

  constructor(size) {
    this.#elements = [];
    this.#lookUpTable = {};
    // size - 1 is because array starts on 0 and goes up to size - 1
    this.#size = size - 1;
    this.#cursor = -1;
  }

  #enqueue(arg1, arg2) {
    this.#cursor++;
    if (this.#cursor > this.#size) {
      this.#cursor = 0;
    }
    // We make sure to delete the entry on the lookUpTable
    // before replacing it on the queue.
    delete this.#lookUpTable[this.#elements[this.#cursor]];
    this.#elements[this.#cursor] = [arg1, arg2];
  }

  #lookAnswer(arg1, arg2) {
    return this.#lookUpTable[[arg1, arg2]];
  }

  cacheLongFunction(func, arg1, arg2) {
    const ans = this.#lookAnswer(arg1, arg2);

    if (ans) {
      return ans;
    }

    const rsp = func(arg1, arg2);

    this.#enqueue(arg1, arg2);
    this.#lookUpTable[[arg1, arg2]] = rsp;

    return rsp;
  }
}

// ------ END OF IMPLEMENTATION ------

// A simple test of the implementation
const size = 3;
const cc = new CustomCache(size);

console.log(cc.cacheLongFunction(aVeryTimeConsumingFunction, "test1", "test2"));
console.log(cc.cacheLongFunction(aVeryTimeConsumingFunction, "test1", "test4"));
console.log(cc.cacheLongFunction(aVeryTimeConsumingFunction, "test1", "test5"));
console.log(cc.cacheLongFunction(aVeryTimeConsumingFunction, "test3", "test5"));
// At this point we're trying to show that the first value for args: test1, test2
// got replaced because size was exceeded, so a new random value is assigned and
// cached for the second call of the same arguments.
console.log(cc.cacheLongFunction(aVeryTimeConsumingFunction, "test1", "test2"));
console.log(cc.cacheLongFunction(aVeryTimeConsumingFunction, "test1", "test2"));
