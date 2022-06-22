/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2022-02-28 15:31:28
 * @LastEditors: kexi
 * @LastEditTime: 2022-02-28 15:37:20
 */
const { parse, print } = require("recast");

// Let's turn this function declaration into a variable declaration.
const code = [
  "function add(a, b) {",
  "  return a +",
  "    // Weird formatting, huh?",
  "    b;",
  "}"
].join("\n");

// Parse the code using an interface similar to require("esprima").parse.
const ast = parse(code);
const add = ast.program.body[0]

console.log(add);