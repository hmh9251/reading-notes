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

  clear() {
    this.top = null;
  }

  display(){
    let currentStack = this.top;
    while(currentStack) {
      console.log(currentStack.val);
      currentStack = currentStack.next;
    }
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

class SampleBrowser{
  constructor() {
    this.normalStack = new Stack();
    this.backStack = new Stack();
  }

  normal(name) {
    this.normalStack.push(name);
    this.backStack.clear();
    this.displayAllStack();
  }

  prev(){
    let val = this.normalStack.pop();
    if(val !== -1) {
      this.backStack.push(val);
      this.displayAllStack();
    }else {
      console.log('无法后退')
    }
  }

  next() {
    let val = this.backStack.pop();
    if(val !== -1) {
      this.normalStack.push(val);
      this.displayAllStack();
    }else {
      console.log('无法前进');
    }
  }

  displayAllStack() {
    console.log('可后退页面---------');
    this.normalStack.display();
    console.log('可前进页面---------');
    this.backStack.display();
    console.log('结束----------------')
  }

}

const browser = new SampleBrowser();

browser.normal('www.google.com');
browser.normal('www.sina.com');
browser.normal('www.baidu.com');
browser.normal('www.qq.com');

browser.prev();
browser.prev();

browser.next();

browser.normal('www.douyu.com')
