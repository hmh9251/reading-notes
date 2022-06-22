<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2022-02-28 15:00:44
 * @LastEditors: kexi
 * @LastEditTime: 2022-02-28 15:57:15
-->
# vue简易模板引擎实现

前端发展至今，市面上三足鼎立，分别由vue、react、angular主导，总国内vue和react的分量更是重中之重，大部分公司的项目也都采用这两个框架。大家平时也都对vue的语法非常熟悉，但是不知道有没有了解过，vue的单文件组件的原理是什么呢？

## 学习今天的分享，你将会获得什么？
1. 了解什么是AST抽象语法树
2. 加强正则表达式的使用和理解
3. 加强递归的理解
4. 加强JavaScript基本语法的理解
5. 基本理解vue单文件组件的编译成原生JavaScript的原理

## 原理解释
```
<div class="newslist">
  <div class="img" v-if="info.showImage"><img src="{{image}}" /></div>
  <div class="date" v-if="info.showDate">{{info.name}}</div>
  <div class="name" v-for="item in info.list">{{item.name}}</div>
</div>
```
这里的vue字符串模板，有v-if、v-for、{{ name }}等基本的vue语法，vue会把这些内容提取出来，转换成响应式函数或者对应的dom事件。
转化流程如下：
1. 使用正则表达式转换AST抽象语法树
2. 将ast语法树转换成js代码
3. 使用new Function来执行js代码

### 什么是AST抽象语法树
抽象语法树 (Abstract Syntax Tree)，简称 AST，它是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。
比如：
```
function add(a, b) {
  return a + b
}
```
用AST来解释解释add函数
```
FunctionDeclaration {
  type: 'FunctionDeclaration',
  id: Identifier {
    type: 'Identifier',
    name: 'add',
    loc: {
      start: [Object],
      end: [Object],
      lines: [Lines],
      tokens: [Array],
      indent: 0
    }
  },
  params: [
    Identifier { type: 'Identifier', name: 'a', loc: [Object] },
    Identifier { type: 'Identifier', name: 'b', loc: [Object] }
  ],
  body: BlockStatement {
    type: 'BlockStatement',
    body: [ [ReturnStatement] ],
    loc: {
      start: [Object],
      end: [Object],
      lines: [Lines],
      tokens: [Array],
      indent: 0
    }
  },
  generator: false,
  expression: false,
  async: false,
  loc: {
    start: { line: 1, column: 0, token: 0 },
    end: { line: 5, column: 1, token: 14 },
    lines: Lines {
      infos: [Array],
      mappings: [],
      cachedSourceMap: null,
      cachedTabWidth: undefined,
      length: 5,
      name: null
    },
    tokens: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    indent: 0
  }
}
```

解析html的AST抽象语法树：
```
{
  tag: tagName, // 标签名
  type: 1, // 元素类型
  children: [], // 孩子列表
  attrs, // 属性集合
  parent: null, // 父元素
  text: null // 文本节点内容
  ...
}
```
