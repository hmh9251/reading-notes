function tokenizeCode(code) {
  const tokens = []; //结果数组
  for (let i = 0; i < code.length; i++) {
    let currentChar = code.charAt(i);
    if (currentChar === ';') {
      //对于这种只有一个字符语法单元，直接加到结果当中
      tokens.push({
        type: 'sep',
        value: ';'
      });
      //该字符已经得到解析，不需要做后续判断， 直接开始下一个
      continue;
    }
    if (currentChar === '(' || currentChar === ')') {
      //与；类似只是语法单元类型不同
      tokens.push({
        type: 'parens',
        value: currentChar
      });
      continue;
    }

    if (currentChar === '{' || currentChar === '}') {
      //与；类似只是语法单元类型不同
      tokens.push({
        type: 'brace',
        value: currentChar
      });
      continue;
    }

    if (currentChar === '>' || currentChar === '<') {
      //与；类似只是语法单元类型不同
      tokens.push({
        type: 'operator',
        value: currentChar
      });
      continue;
    }

    if (currentChar === '"' || currentChar === '\'') {
      //表示一个字符串的开始
      const token = {
        type: 'string',
        value: currentChar
      };
      tokens.push(token);

      const closer = currentChar;
      let escaped = false; //表示下一个字符是不是被转译的

      //进行嵌套循环遍历，寻找字符串结尾
      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        token.value += currentChar;
        if (escaped) {
          escaped = false;
        } else if (currentChar === '\\') {
          // 如果当前字符是 \ ，将转译状态设为true，下一个字符不会被特殊处理
          escaped = true;
        } else if (currentChar === closer) {
          break;
        }
      }
      continue;
    }

    if (/[0-9]/.test(currentChar)) {
      //数字以0到9字符开始
      const token = {
        type: 'number',
        value: currentChar
      };
      tokens.push(token);

      for(i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        if (/[0-9\.]/.test(currentChar)) {
          // 如果遍历到的字符还是数字的一部分（0到9或小数点）
          // 这里暂不考虑会出现多个小数点以及其他进制的情况
          token.value += currentChar;
        } else {
          // 遇到不是数字的字符就退出，需要把 i 往回调，
          // 因为当前的字符并不属于数字的一部分，需要做后续解析
          i--;
          break;
        }
      }
      continue;
    }

    if (/[a-zA-Z\$\_]/.test(currentChar)) {
      const token = {
        type: 'idenntifier',
        value: currentChar
      }

      tokens.push(token);

      // 与数字同理
      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        if (/[a-zA-Z0-9\$\_]/.test(currentChar)) {
          token.value += currentChar;
        } else {
          i--;
          break;
        }
      }
      continue;
    }

    if (/\s/.test(currentChar)) {
      const token = {
        type: 'whitespace',
        value: currentChar
      };
      tokens.push(token);

      // 与数字同理
      for (i++; i < code.length; i++) {
        currentChar = code.charAt(i);
        if (/\s]/.test(currentChar)) {
          token.value += currentChar;
        } else {
          i--;
          break;
        }
      }
      continue;
    }

    throw new Error('Unexpected ' + currentChar);
  }
  return tokens;
}

const tokens = tokenizeCode(`
if (1 > 0) {
  alert("if 1 > 0");
}
`);

console.log(tokens);