/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-23 17:09:04
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-23 17:18:43
 */
module.exports = function(input) {
  console.log('========================');
  let random = Math.random() * 3;
  let result = '';
  
  if (random < 1) {
    result = '剪刀';
  } else if (random > 2) {
    result = '石头';
  } else {
    result = '布';
  }
  
  console.log('对方出了:' + result);
  if (result === input) {
    console.log('平局');
    return 0;
  } else if (
    (input === '剪刀' && result === '布') ||
    (input === '布' && result === '石头') ||
    (input === '石头' && result === '剪刀')
  ) {
    console.log('你赢了')
    return 1;
  } else {
    console.log('你输了');
    return -1;
  }
}