
/**
 * 链表反转，遍历反转
 */

class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList {
  constructor(val) {
    this.head = new Node(val);
    this.currentNode = null;
  }

  append(val) {
    let newNode = new Node(val);
    let currNode = this.findLast();
    currNode.next = newNode;
  }

  findLast() {
    let currNode = this.head;
    while (currNode.next) {
      currNode = currNode.next;
    }
    return currNode;
  }

  reserve() {
    let head = this.head;
    //小于2的时候无需反转
    if (head === null || head.next === null) {
      return head;
    }
    var p = head.next;
    head.next = null;  
    var temp;    
    while (p !== null) {
      temp = p.next;
      p.next = head;
      head = p;
      p = temp;
    }
    this.head = head;
  }

  showValue() {
    let arr = [];
    let currentNode = this.head;
    arr.push(currentNode.value);
    while(currentNode.next) {
      currentNode = currentNode.next;
      arr.push(currentNode.value);
    }
    return arr;
  }
  
}

let linkedList = new LinkedList(0);
for(let i = 1; i < 10; i++) {
  linkedList.append(i);
}
console.log(linkedList.showValue());

linkedList.reserve();
console.log(linkedList.showValue());