interface IQueue<T> {
  enqueue(item: T): void;
  next(): T;
  hasNext(): boolean;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  constructor(private storage: T[] = [], private capacity: number = storage.length) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }

  hasNext(): boolean {
    return this.storage.length > 0;
  }

  next(): T {
    if (!this.hasNext()) {
      throw new Error("Pulling from empty queue!");
    }
    return this.storage.shift()!!;
  }

  size(): number {
    return this.storage.length;
  }
}