/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-12-07 09:31:06
 * @LastEditors: kexi
 * @LastEditTime: 2021-12-07 09:50:53
 */

class ArrayList {
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
    this.arr[this.size] = val;
  }
}