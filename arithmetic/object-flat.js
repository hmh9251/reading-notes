/*
 * @Desc: 对象扁平化
 * @Author: kexi
 * @Date: 2022-01-04 09:40:04
 * @LastEditors: kexi
 * @LastEditTime: 2022-01-04 10:16:12
 */

function flat(obj, key = "", result = {}, isArray = false) {
  for (let [k, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      let tmp = isArray ? `${key}[${k}]` : `${key}${k}`;
      flat(value, tmp, result, true);
    } else if (typeof value === 'object') {
      let tmp = isArray ? `${key}[${k}]` : `${key}${k}.`;
      flat(value, tmp, result);
    } else {
      let tmp = isArray ? `${key}[${k}]` : `${key}${k}`;
      result[tmp] = value;
    }
  }
  return result;
}

var entryObj = {
  a: {
      b: {
          c: {
              dd: 'abcdd'
          }
      },
      d: {
          xx: 'adxx'
      },
      e: 'ae'
  }
};
var result = flat(entryObj);
console.log(result);
