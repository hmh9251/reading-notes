/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2020-07-17 17:09:52
 * @LastEditors: kexi
 * @LastEditTime: 2020-07-17 17:29:10
 */ 

 const PENDING = "PENDING";
 const FULFILLED = "FULFILLED";
 const REJECTED = "REJECTED";

 class Promise {
   constructor(exec) {
     this.state = PENDING;
     this.value = null;
     this.reason = null;

     this.onFulFilledList = [];
     this.onRejectedList = [];

     let resolve = value => {
       if (this.state === PENDING) {
         this.value = value;
         this.state = FULFILLED;
         this.onFulFilledList.forEach(fn => fn());
       }
     }

     let reject = value => {
       if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = value;
        this.onRejectedList.forEach(fn => fn());
       }
     }

     try {
       exec(resolve, reject);
     } catch (error) {
       reject(error);
     }
   }

   then(onFulFilled, onRejected) {
     if (this.state === FULFILLED) {
       onFulFilled(this.value);
     }

     if (this.state === REJECTED) {
       onRejected(this.reason);
     }

     if (this.state === PENDING) {
       this.onFulFilledList.push(() => {
         onFulFilled(this.value);
       })

       this.onRejectedList.push(() => {
         onRejected(this.reason);
       })
     }
   }
 }

 const p = new Promise((resolve, reject) => {
   setTimeout(() => {
     resolve("成功了吗");
   }, 1000);
 })

 p.then(data => {
   console.log(data);
 }, error => {
   console.error(error)
 })