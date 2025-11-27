class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class Stack {
  constructor() {
    this.top = null;
    this.size = 0;
  }

  push(value) {
    const node = new Node(value);
    node.next = this.top;
    this.top = node;
    this.size++;
  }

  pop() {
    if (this.top === null) {
      return null;
    }

    const poppedValue = this.top.value;
    this.top = this.top.next;
    this.size--;
    return poppedValue;
  }

  peek() {
    if (this.top === null) {
      return null;
    }

    return this.top.value;
  }

  print() {
    let currentNode = this.top;
    while (currentNode !== null) {
      console.log(currentNode.value);
      currentNode = currentNode.next;
    }
  }

  toArray() {
    const array = [];
    let currentNode = this.top;
    while (currentNode !== null) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return array;
  }
}
