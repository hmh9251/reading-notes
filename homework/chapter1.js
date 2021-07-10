/**
 * 将十进制转换成六十四进制, 结果保留7位小数
 * 这里约定六十进制数结尾加上$64
 * @param {number} num 
 * @returns string
 */
function transition10to64(num) {
  if (typeof num !== 'number') return new Error('请输入正确的十进制数字');
  if (num === 0) return '0$64';
  let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ~-'.split(''),
    // 64
    radix = chars.length,
    // 获取符号
    sign = Math.sign(num).toString().charAt(0),
    // 取正整数部分
    integer = +parseInt(num),
    decimals = isDecimals(num);
    integerResult = [],
    decimalResult = [];
  
  
    while (integer > 0) {
      let remainder = integer % radix;
      integer = parseInt(integer / radix);
      integerResult.unshift(chars[remainder]);
    }

    while(isDecimals(decimals) && decimalResult.length < 8) {
      let res = decimals * radix;
      decimalResult.push(chars[parseInt(res)]);
      decimals = isDecimals(res);
    }
    return (sign === -1 ? '-' : '') + integerResult.join('') + 
      (decimalResult.length > 0 ? '.' + decimalResult.join('') : '') + '$64';
}

/**
 * 将六十四进制的数转换成十进制
 * @param {string} num 
 * @return number
 */
function transition64to10(num) {
  if (num.slice(-3) !== "$64") return new Error('请输入正确的64进制数');
  if (num === '0$64') return 0;
  let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ~-'.split(''),
    // 64
    radix = chars.length,
    // 获取符号
    sign = num.charAt(0) === "-" ? '-' : '',
    index = num.indexOf('.'),
    integer = num.slice(0, index),
    decimals = num.slice(index + 1),
    i = 0,
    len = integer.length;
    result = 0;

    while (i < len) {
      result += Math.pow(radix, i++) * chars.indexOf(integer.charAt(len - i) || 0);
    }

    i = 0;
    len = decimals.length;
    while(i < len) {
      result += Math.pow(radix, -(i + 1)) * chars.indexOf(decimals.charAt(i) || 0);
      i++;
    }
    return result;
}
/**
 * 判断是否是小数部分，如果是则返回小数部分,否则返回false
 * @param {number} num 
 * @return number
 */
function isDecimals(num) {
  if (typeof num !== 'number') return false;
  let str = num.toString(), 
    index = str.indexOf('.');
  if (index > -1) {
    return parseFloat(str.slice(index));
  }
  return false;
}

let num = parseFloat(Math.random()*100000000 + Math.random);
console.log(num);
let to64 = transition10to64(num);
console.log(to64);
console.log(transition64to10(to64));