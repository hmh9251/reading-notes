/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-12-07 09:31:06
 * @LastEditors: kexi
 * @LastEditTime: 2021-12-07 10:20:27
 */

// 实现一个支持动态扩容的数组
class ArrayList1 {
  constructor() {
    this.initSize = 0;
    this.size = 0;
    this.arr = new Array(this.initSize);
  }

  setSize(num) {
    if (num <= 0) throw new Error('数组大小不能小于等于0');
    if (num <= this.initSize) throw new Error('新定义的数组大小不能小于原数组大小');
    let newArr = new Array(num);
    let oldArr = this.arr;
    for(let i = 0; i < num; i++) {
      newArr[i] = oldArr[i];
    }
    this.initSize = num;
    this.arr = newArr;
  }

  add(val) {
    if (this.size > this.arr.length) throw new Error('数组出错');
    if (this.size === this.arr.length) {
      this.setSize(2 * this.arr.length);
    }
    this.arr[this.size++] = val;
  }
}

// 实现一个大小固定的有序数组，支持动态增删改操作
class ArrayList2 {
  constructor(num) {
    if (num <= 0) throw new Error('数组大小不能小于等于0');
    this.initSize = num;
    this.useIndex = 0;
    this.arr = new Array(num);
  }

  add(val) {
    if (this.useIndex === this.initSize) {
      throw new Error('数组已满，无法新增');
    }
    this.arr[this.useIndex++] = val;
  }

  update(index, val) {
    if (index > this.initSize) throw new Error('超出数组大小');
    this.arr[index] = val;
    for (let i = 0; i <= index; i++) {
      if (i === index) {
        this.arr[i] = val;
      }
    }
  }

  del(index) {
    if (index > this.initSize) throw new Error('超出数组大小');
    let oldVal = null;
    for (let i = 0; i <= index; i++) {
      if (i === index) {
        oldVal = this.arr[i];
        this.arr[i] = null;
      }
    }
    return oldVal;
  }
}
