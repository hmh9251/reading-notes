class Node{
  constructor(element){
    this.element = element;
    this.next = null;
  }
}

class LinkedList{
  constructor(first) {
    this.length = 1;
    this.head = new Node(first);
  }

  add(element) {
    let node = new Node(element);
    let currentNode = this.head;
    while(currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = node;
    this.length++;
  }

  insert(n,element){
    if(n > (this.length - 1) || n < 0) throw new Error("不合法的位置")
    let node = new Node(element);
    this.length++;
    if(n === 0) {
      node.next = this.head;
      this.head = node;
      return;
    }
    let currentNode = this.head,
        i = 0;
    while(i < (n-1) && currentNode.next !== null) {
      currentNode = currentNode.next;
      i++;
    }
    node.next = currentNode.next;
    currentNode.next = node;
  }

  find(n){
    if(n > (this.length - 1) || n < 0) throw new Error("不合法的位置")
    if(n === 0) return this.head;
    let i = 0;
    let currentNode = this.head;
    while(i < n) {
      currentNode = currentNode.next;
      i++;
    }
    return currentNode;
  }

  remove(n) {
    if(n > (this.length - 1) || n < 0) throw new Error("不合法的位置");
    this.length--;
    if(n === 0) {
      this.head = this.head.next
      return;
    }
    let i = 0;
    let currentNode = this.head;
    while(i < n-1) {
      currentNode = currentNode.next;
      i++;
    }
    currentNode.next = currentNode.next.next;
  }

  removeLastIndex(n) {
    if(n > (this.length) || n < 1) throw new Error("不合法的位置");
    this.remove(this.length - n);
  }

  //反转链表
  reversal() {
    let end = null;
    let currentNode = this.head;
    
    while(currentNode.next !== null) {
      let temporary = currentNode.next;
      currentNode.next = end;
      end = currentNode;
      currentNode = temporary;
    }
    currentNode.next = end;
    this.head = currentNode;
  }
}


//创建对象
let linkedList = new LinkedList(1);
linkedList.add(3);
linkedList.add(5);
linkedList.add(7);
linkedList.add(9);
linkedList.add(10);

let linkedList2 = new LinkedList(2);
linkedList2.add(2);
linkedList2.add(2);
linkedList2.add(6);
linkedList2.add(6);
linkedList2.add(7);
linkedList2.add(8);





//新增节点
// linkedList.add('end');

//插入节点
// linkedList.insert(0,'insert');



// linkedList.remove(2)
// linkedList.reversal(); 
// linkedList.removeLastIndex(2);

console.log(linkedList);
console.log(linkedList2);

function mergeTwoLists(l1, l2){
  let dummy = new Node(-1);
  let currentNode = dummy;

  while(l1 !== null && l2 !== null) {
    if(l1.element <= l2.element) {
      currentNode.next = l1;
      l1 = l1.next;
    } else {
      currentNode.next = l2;
      l2 = l2.next
    }
    currentNode = currentNode.next;
  }
  currentNode.next = (l1 !== null ) ? l1 : l2;
  return dummy;
}

function middleNode(l1) {
  let slow = l1, fast = l1;
  while(fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// console.log(mergeTwoLists(linkedList.head, linkedList2.head));

console.log(middleNode(linkedList.head))

//中环链表
let head = new Node(1);
let currentNode = head;
let node = null;
for(let i = 2; i < 12; i++) {
  currentNode.next = new Node(i);
  currentNode = currentNode.next;
  if(i === 8) {
    node = currentNode;
  }
}
// currentNode.next = node;

//中环链表检测
function DetectLoop (l1){
  let slow = l1, fast = l1.next;
  do{
    if(slow === fast) return true;
    slow = slow.next;
    fast = fast.next.next;
  }while(fast !== null && fast.next !== null)
  return false;
}

console.log(DetectLoop(head));