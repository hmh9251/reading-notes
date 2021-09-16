/*
 * @Desc: 手写一个promise
 * @Author: kexi
 * @Date: 2020-07-17 17:09:52
 * @LastEditors: kexi
 * @LastEditTime: 2021-09-16 12:01:12
 */ 

const PENDING = "PENDING";
const FULLFILLED = "FULLFILLED";
const REJECTED = "REJECTED";

class Promise{
  constructor(fn) {
    this.state = PENDING;
    this.value = undefined;
    this.error = undefined;
    this.onFullCallback = [];
    this.onFailCallback = [];
    // 这里要用订阅发布模式，等到方法执行完毕，才去调用then里面的方法
    const resolve = (value) => {
      this.value = value;
      this.state = FULLFILLED;
      // 循环所有方法并执行
      this.onFullCallback.forEach(cb => {
        cb(this.value);
      })
    }

    const reject = (value) => {
      this.error = value;
      this.state = REJECTED;
      this.onFailCallback.forEach(cb => {
        cb(this.error);
      })
    }
    
    fn(resolve, reject);
  }

  then(cb1, cb2) {
    let state = this.state;
    var promise2 = new Promise((resolve, reject) => {
      if (state === FULLFILLED) {
        let x = cb1(this.value);
        resolvePromise(promise2, x, resolve, reject);
      } else if (state === REJECTED) {
        let x = cb2(this.error);
        resolvePromise(promise2, x, resolve, reject);
      } else {
        this.onFullCallback.push(() => {
          let x = cb1(this.value);
          resolvePromise(promise2, x, resolve, reject);
        });
        this.onFailCallback.push(() => {
          let x = cb2(this.error);
          resolvePromise(promise2, x, resolve, reject);
        });
      }
    })
    return promise;
  }
}

function resolvePromise(promise, x, resolve, reject)  {
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called;
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(promise, y, resolve, reject);
        }, err => {
          if (called) return;
          called = true;
          reject(err);
        })
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}


// demo1
const promise = new Promise(function(resolve, reject) {
  // ... some code
  if (1){
    setTimeout(() => {
      resolve('success');
    }, 1000);
  } else {
    reject('fail');
  }
});

promise.then((data) => {
  console.log('cb1');
  console.log(data);
}, err => {
  console.log(err);
}).then(data => {
  console.log('cb1: then2')
  console.log(data);
}, err => {
  console.log(err);
})

/* promise.then(data => {
  console.log('cb2');
  console.log(data);
}) */