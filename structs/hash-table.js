export class HashTable {
  constructor(size) {
    this.size = 0;
    this.table = new Array(size);
  }

  _hash(key) {
    let hash = 0;
    for (let index = 0; index < key.length; index++) {
      hash += index * key.charCodeAt(index);
    }

    return Math.abs(hash % this.table.length);
  }

  get(key) {
    const hash = this._hash(key);
    if (this.table[hash] === undefined) {
      return null;
    }

    for (let index = 0; index < this.table[hash].length; index++) {
      const [key_, value_] = this.table[hash][index];
      if (key === key_) {
        return value_;
      }
    }

    return null;
  }

  set(key, value) {
    const hash = this._hash(key);

    if (this.table[hash] === undefined) {
      this.table[hash] = [];
    }

    for (let index in this.table[hash]) {
      const [key_] = this.table[hash][index];
      if (key_ === key) {
        this.table[hash][index] = [key, value];
        return;
      }
    }

    this.table[hash].push([key, value]);
    this.size++;
  }

  toObject() {
    return this.table
      .flat()
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }
}
