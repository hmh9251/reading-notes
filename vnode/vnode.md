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
//VNode原型
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
//子组件原型
const ChildrenFlags = {
  // 未知的 children 类型
  UNKNOWN_CHILDREN: 0,
  // 没有 children
  NO_CHILDREN: 1,
  // children 是单个 VNode
  SINGLE_VNODE: 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES: 1 << 3,
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

### 渲染器
所谓渲染器，简单的说就是将 Virtual DOM 渲染成特定平台下真实 DOM 的工具(就是一个函数，通常叫 render)，渲染器的工作流程分为两个阶段：mount 和 patch，如果旧的 VNode 存在，则会使用新的 VNode 与旧的 VNode 进行对比，试图以最小的资源开销完成 DOM 的更新，这个过程就叫 patch，或“打补丁”。如果旧的 VNode 不存在，则直接将新的 VNode 挂载成全新的 DOM，这个过程叫做 mount。

```
function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}
```
整体思路非常简单，如果旧的 VNode 不存在且新的 VNode 存在，那就直接挂载(mount)新的 VNode ；如果旧的 VNode 存在且新的 VNode 不存在，那就直接将 DOM 移除；如果新旧 VNode 都存在，那就打补丁(patch)：

| 旧 VNode | 新 VNode	 | 操作 |
| :----: | :----: | :----: |
| ❌ | ✔️ | 调用 mount 函数 |
| ✔️ | ❌ | 移除 DOM |
| ✔️ | ✔️ | 调用 patch 函数|


mount函数
```
function mount(vnode, container) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container)
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container)
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container)
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container)
  }
}
```
最简单的mountElement函数
```
function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  container.appendChild(el)
}
```

加强的mountElement
```
function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  vnode.el = el
  // 省略处理 VNodeData 的代码

  // 拿到 children 和 childFlags
  const childFlags = vnode.childFlags
  const children = vnode.children
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 如果是单个子节点则调用 mount 函数挂载
      mount(children, el)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是单多个子节点则遍历并调用 mount 函数挂载
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el)
      }
    }
  }

  container.appendChild(el)
}
```
patch函数
```
function patch(prevVNode, nextVNode, container) {
  // 分别拿到新旧 VNode 的类型，即 flags
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
  // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}
```
patchElement函数
```
function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  // 拿到 新旧 VNodeData
  const prevData = prevVNode.data
  const nextData = nextVNode.data
  // 新的 VNodeData 存在时才有必要更新
  if (nextData) {
    // 遍历新的 VNodeData
    for (let key in nextData) {
      // 根据 key 拿到新旧 VNodeData 值
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      switch (key) {
        case 'style':
          // 遍历新 VNodeData 中的 style 数据，将新的样式应用到元素
          for (let k in nextValue) {
            el.style[k] = nextValue[k]
          }
          // 遍历旧 VNodeData 中的 style 数据，将已经不存在于新的 VNodeData 的数据移除
          for (let k in prevValue) {
            if (!nextValue.hasOwnProperty(k)) {
              el.style[k] = ''
            }
          }
          break
        default:
          break
      }
    }
  }
}
```
