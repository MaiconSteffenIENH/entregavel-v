class BSTNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BST {
  constructor() {
    this.root = null;
  }

  insert(key, value) {
    this.root = this._insertNode(this.root, key, value);
  }

  _insertNode(node, key, value) {
    if (!node) {
      return new BSTNode(key, value);
    }

    if (key < node.key) {
      node.left = this._insertNode(node.left, key, value);
    } else if (key > node.key) {
      node.right = this._insertNode(node.right, key, value);
    } else {
      node.value = value;
    }
    return node;
  }

  search(key) {
    return this._searchNode(this.root, key);
  }

  _searchNode(node, key) {
    if (!node || node.key === key) {
      return node ? node.value : null;
    }

    if (key < node.key) {
      return this._searchNode(node.left, key);
    }
    return this._searchNode(node.right, key);
  }

  remove(key) {
    this.root = this._removeNode(this.root, key);
  }

  _removeNode(node, key) {
    if (!node) return null;

    if (key < node.key) {
      node.left = this._removeNode(node.left, key);
    } else if (key > node.key) {
      node.right = this._removeNode(node.right, key);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let minNode = this._findMin(node.right);
      node.key = minNode.key;
      node.value = minNode.value;
      node.right = this._removeNode(node.right, minNode.key);
    }
    return node;
  }

  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  inOrder() {
    const result = [];
    this._inOrderTraversal(this.root, result);
    return result;
  }

  _inOrderTraversal(node, result) {
    if (node) {
      this._inOrderTraversal(node.left, result);
      result.push({ key: node.key, value: node.value });
      this._inOrderTraversal(node.right, result);
    }
  }
}