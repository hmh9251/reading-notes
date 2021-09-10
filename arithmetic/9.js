/*
 * @Desc: 回文数
 * @Author: kexi
 * @Date: 2021-09-10 11:52:37
 * @LastEditors: kexi
 * @LastEditTime: 2021-09-10 16:15:41
 */

/**
 * 给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。
回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。例如，121 是回文，而 123 不是。

 * @param {*} x 
 * @returns 
 */
let isPalindrome = function(x) {
  let m = x.toString();
  let length = m.length;
  for(let i = 0; i < length; i++) {
      let a = m.charAt(i);
      let b = m.charAt((length - 1) - i);
      if (a != b) return false;
  }
  return true;
};

console.log(isPalindrome(121))
console.log(isPalindrome(123))
