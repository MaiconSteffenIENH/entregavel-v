class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class Queue {
  constructor() {
    this.start = null;
    this.end = null;
    this.size = 0;
  }

  enqueue(value) {
    const node = new Node(value);

    if (this.end !== null) {
      this.end.next = node;
    }

    this.end = node;

    if (this.start === null) {
      this.start = this.end;
    }

    this.size++;
  }
  dequeue() {
    if (this.start === null) {
      return null;
    }

    const node = this.start;
    this.start = this.start.next;

    if (this.start === null) {
      this.end = null;
    }

    this.size--;
    return node.value;
  }
  isEmpty() {
    return this.size === 0;
  }
  clear() {
    this.start = null;
    this.end = null;
    this.size = 0;
  }
  peek() {
    if (this.start === null) {
      return null;
    }

    return this.start.value;
  }
  print() {
    let node = this.start;
    while (node) {
      console.log(node.value);
      node = node.next;
    }
  }

  toArray() {
    const array = [];
    let node = this.start;
    while (node) {
      array.push(node.value);
      node = node.next;
    }

    return array;
  }
}
