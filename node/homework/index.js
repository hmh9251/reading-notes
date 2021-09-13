/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-23 14:36:22
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-23 17:18:44
 */
let input = process.argv[process.argv.length - 1];

console.log('你出了:' + input);
let game = require('./lib.js');

let count = 0;
process.stdin.on('data', e => {
  const input = e.toString().trim();
  let result = game(input);
  if (result === 1) {
    count++;
  }
  if (count === 3) {
    console.log('你牛逼，不玩了');
    process.exit();
  }
})

