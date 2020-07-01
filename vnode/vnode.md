# 组件的本质
## 组件是什么
### jQuery时代，组件就是“模板引擎 + 数据 = html字符串”
```
import { template } from 'lodash'

//编写模板
const compiler = template('<h1><%= title %></h1>')
//插入数据生成html字符串
const html = compiler({ title: 'My Component' })
//将字符串插入html生成dom
document.getElementById('app').innerHTML = html

```

### MVVM时代，组件就是“模板 + 数据 = Virtual Dom”
```
import { h } from 'snabbdom'

// h 函数用来创建 VNode，组件的产出是 VNode
const MyComponent = props => {
  return h('h1', props.title)
}
//将字符串插入html生成dom
document.getElementById('app').innerHTML = MyComponent
```

### 什么是Virtual Dom
> Virtual DOM 本质上是JavaScript对象，是对真实DOM的的一种描述方式。
> 为何组件要从直接产出 html 变成产出 Virtual DOM 呢？其原因是 Virtual DOM 带来了 分层设计，它对渲染过程的抽象，使得框架可以渲染到 web(浏览器) 以外的平台，以及能够实现 SSR 等。

### 设计一个Virtual Dom

组件类型
```
const VNodeFlags = {
  // html 标签
  ELEMENT_HTML: 1,
  // SVG 标签
  ELEMENT_SVG: 1 << 1,

  // 普通有状态组件
  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 已经被keepAlive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,

  // 纯文本
  TEXT: 1 << 6,
  // Fragment
  FRAGMENT: 1 << 7,
  // Portaly
  PORTAL: 1 << 8,
};
```
VNode原型
```
export interface VNode {
  // _isVNode 它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
  _isVNode: true
  // el 当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
  el: Element | null
  flags: VNodeFlags
  tag: string | FunctionalComponent | ComponentClass | null
  data: VNodeData | null
  children: VNodeChildren
  childFlags: ChildrenFlags
}
```
用VNode描述真实DOM
```
const elementVNode = {
  tag: 'div',
  data: {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  }
}

const elementVNode = {
  tag: 'div',
  data: null,
  children: {
    tag: 'span',
    data: null
  }
}

const elementVNode = {
  tag: 'div',
  data: null,
  children: [
    {
      tag: 'h1',
      data: null
    },
    {
      tag: 'p',
      data: null
    }
  ]
}
```

### 创建VNode的h函数
1. 最简单的VNode函数
```
function h(tag, data = null, children = null) {
  return {
    _isVNode: true,
    flags: VNodeFlags.ELEMENT_HTML,
    tag: tag,
    data: data,
    children: children,
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}
```
2. 让我们变得复杂一点
```
function h(tag, data = null, children = null) {
  //判断flags类型
  let flags = null;
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if {
    ...
  } else {
    ...
  }
  // 
  let childFlags = null;
  if (Array.isArray(children)) {
    const { length } = children;
    if (length === 0) {
      childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (length === 1) {
      childFlags = ChildrenFlags.SINGLE_VNODE;
      children = children[0];
    } else {
      childFlags = ChildrenFlags.KEYED_VNODES;
      children = normalizeVNodes(children);
    }
  } else if (children == null) {
    ...
  }
  return {
    _isVNode: true,
    flags: flags,
    tag: tag,
    data: data,
    children: children,
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}
```

