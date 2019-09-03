class Node{
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class Stack{
  constructor(){
    this.top = null;
  }

  push(value){
    const node = new Node(value);
    if(this.top === null) {
      this.top = node;
    } else {
      node.next = this.top;
      this.top = node;
    }
  }

  pop(){
    if(this.top === null) return -1;
    let node = this.top.val;
    this.top = this.top.next;
    return node;
  }
}

const stack = new Stack();

stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4);

console.log(stack.pop())
console.log(stack.pop())
console.log(stack.pop())
console.log(stack.pop());