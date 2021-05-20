/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2020-07-17 17:09:52
 * @LastEditors: kexi
 * @LastEditTime: 2021-05-20 11:45:38
 */ 

 const PENDING = "PENDING";
 const FULLFILLED = "FULLFILLED";
 const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;

    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];

    let resolve = value => {
      if (this.state === PENDING) {
        this.state = FULLFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }

    let reject = reason => {
      if (this.state = PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      executor(resolve, reject);
    } catch(err) {
      console.log('43');
      reject(err);
    }
  }

  then(onFullfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    let promise2 = new Promise((resolve, reject) => {
      if (this.state === FULLFILLED) {
        let x = onFullfilled(this.value);
        resolvePromise(promise2, x, resolve, reject);
      }
      if (this.state === REJECTED) {
        let x = onRejected(this.reason);
        resolvePromise(promise2, x, resolve, reject);
      }
      // 当状态state为pending时
      if (this.state === PENDING) {
        // onFulfilled传入到成功数组
        this.onResolvedCallbacks.push(()=>{
          let x = onFullfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        })
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(()=>{
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        })
      }
    })

    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject){
  // 循环引用报错
  if(x === promise2){
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 防止多次调用
  let called;
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') { 
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          // resolve的结果依旧是promise 那就继续解析
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          reject(err);// 失败了就失败了
        })
      } else {
        resolve(x); // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e); 
    }
  } else {
    resolve(x);
  }
}


let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('就这样')
  }, 2000)
});
p.then(data => {
  console.log('72')
  console.log(data)
  return '那不这样呢';
}, err => {
  console.log('74')
  console.log(err)
}).then(data => {
  console.log('133');
  console.log(data);
})

/* p.then(data => {
  console.log('78')
  console.log(data)
}, err => {
  console.log('82')
  console.log(err)
}); */