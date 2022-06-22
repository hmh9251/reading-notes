

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 表示匹配不捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 > 

function parseHTML(html) {
  let root, parent, stack = []
  // 只要剩余的 html 不为空就一直解析
  while (html) {
    // 判断第一个字符是不是<
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      // 解析开始标签
      const { tag, attrs, isClose } = parseStartTag() || {}
      if (tag) {
        start(tag, attrs);
        if (isClose) end(tag);
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    } else {
      const text = textEnd > 0 ? html.substring(0, textEnd) : html
      advance(text.length)
      chars(text)
    }
  }
  // 获取截取后剩余的html
  function advance(n) {
    html = html.substring(n)
  }
  // 解析开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      // isClose: 是否是单闭合标签
      const match = { tag: start[1], attrs: [], isClose: false }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
        advance(attr[0].length)
      }
      if (end) {
        if (trim(end[0]) === '/>') match.isClose = true;
        advance(end[0].length)
        return match
      }
    }
  }
  // 解析到开始标签时触发
  function start(tag, attrs) {
    const el = createASTElement(tag, attrs)
    if (!root) root = el
    stack.push((parent = el))
    processFor(el) // 处理 v-for
    processIf(el) // 处理 v-if
    processAttrs(el) // 处理 v-on、v-show、v-bind 等
  }
  // 解析到结束标签时触发
  function end(tag) {
    const el = stack.pop()
    parent = stack[stack.length - 1]
    if (parent) {
      el.parent = parent
      parent.children.push(el)
    }
  }
  // 解析到文本时触发
  function chars(text) {
    text = text.trim()
    if (!text) return
    const el = { type: 3, text }
    if (parent) {
      parent.children.push(el)
      el.parent = parent
    }
  }
  return root
}
// 创建元素节点
function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: [],
  }
}
// 把数组类型的属性转换为对象
function makeAttrsMap(attrs) {
  const map = {}
  attrs.forEach((it) => (map[it.name] = it.value))
  return map
}

function trim(str) {
  return str.replace(/^\s+|\s$/g, "");
}
// 获取并删除数组中的某个属性
function getAndRemoveAttr(el, name) {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  return val
}
// 处理v-for
function processFor(el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const inMatch = exp.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/)
    if (!inMatch) return
    Object.assign(el, {
      alias: inMatch[1].trim(),
      for: inMatch[2].trim(),
    })
  }
}
// 处理v-if
function processIf(el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) el.if = exp
}
// 处理各种属性，这里以v-on为例
function processAttrs(el) {
  const list = el.attrsList,
    onRE = /^@|^v-on:/
  let i, l, name, rawName, value
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (onRE.test(name)) {
      name = name.replace(onRE, '')
      el.events = { [name]: value }
      list.splice(i, 1)
      break
    }
  }
}

/**
 * 解析ast树为dom
 * @param {} AST 
 * 这个版本是拿到ast树直接渲染dom，结果v-for不好处理，还有其他模板语法估计也不是很好处理
 */
/* function parseToHTML(AST, data) {
  let f = document.createDocumentFragment();
  let dom = [];
  if (AST.type === 1) {
    dom = parseTag(AST, data);
  } else if (AST.type === 3) {
    dom = parseText(AST, data);
  }
  f.appendChild(dom);
  return f;
}

function parseTag(dom, data) {
  let f = document.createDocumentFragment();
  let tag = document.createElement(dom.tag);
  let isRender = true;
  if(dom.attrsMap['v-if']) {
    isRender = createFunc(data, dom.attrsMap['v-if']);
    if (!isRender) return f;
  }
  if (dom.attrsList) {
    dom.attrsList.forEach(attr => {
      tag.setAttribute(attr.name, attr.value);
    })
  }
  if(dom.attrsMap['src']) {
    tag.setAttribute('src',pText(dom.attrsMap['src'], data));
  }
  if (dom.children) {
    dom.children.forEach(child => {
      tag.appendChild(parseToHTML(child, data));
    })
  }
  f.appendChild(tag);
  return f;
}

function parseText(dom, data) {
  let text = dom.text.replace(/\{\{(.*?)\}\}/g, (s0, s1) => {
    let props = s1.split(".");
    let val = data[props[0]];
    props.slice(1).forEach((item) => {
      val = val[item];
    });
    return val;
  })
  return document.createTextNode(text);
}

function pText(str, data) {
  return str.replace(/\{\{(.*?)\}\}/g, (s0, s1) => {
    let props = s1.split(".");
    let val = data[props[0]];
    props.slice(1).forEach((item) => {
      val = val[item];
    });
    return val;
  })
}

function createFunc(data, exp) {
  const func = new Function('data', `with(data){return ${exp}}`)
  return func(data);
} */

/**
 * 新修改一版本，是将AST直接处理vdom
 */

function generate(node) {
  return node.type === 1 ? genElement(node) : genText(node.text)
}

function genElement(el) {
  const { tag, attrsList, children } = el
  const childNodes = children.map((child) => generate(child))
  if (el.for && !el.forProcessed) {
    el.forProcessed = true
    return (
      `_l((${el.for}),` +
      `function(${el.alias}){` +
      `return ${genElement(el)}` +
      '})'
    )
  } else if (el.if && !el.ifProcessed) {
    el.ifProcessed = true
    return `${el.if} ? ${genElement(el)}: _e('')`
  }
  return `_c('${tag}',${genAttrs(attrsList)},${childNodes})`
}

function genAttrs(attrs) {
  // const obj = {}
  let objStr = "{";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      const kv = {} // 对样式进行特殊的处理
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        kv[key.trim()] = value.trim()
      })
      attr.value = kv
    }
    // obj[attr.name] = attr.value
    if (attr.name.indexOf('v-bind') !== -1) {
      objStr += `"${attr.name.split(':')[1]}": ${attr.value},`;
    } else {
      objStr += `"${attr.name}":"${attr.value}",`;
    }
  }
  objStr += '}';
  // return JSON.stringify(obj)
  return objStr;
}

function genText(text) {
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  if (!defaultTagRE.test(text)) {
    return `_v(${JSON.stringify(text)})`
  }
  let tokens = []
  let lastIndex = (defaultTagRE.lastIndex = 0)
  let match, index
  while ((match = defaultTagRE.exec(text))) {
    index = match.index
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    tokens.push(`_s(${match[1].trim()})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  return `_v(${tokens.join('+')})`
}

function _c(tag, data, ...children) {
  return { tag, data, type: 1, children: children.flat() }
}
function _v(text) {
  return { text, type: 3 }
}

function _s(val) {
  if (val == null) return ''
  if (typeof val == 'object') return JSON.stringify(val, null, 2)
  return String(val)
}

function _l(val, render) {
  const ret = new Array(val.length)
  for (i = 0, l = val.length; i < l; i++) {
    ret[i] = render(val[i], i)
  }
  return ret
}

function _e(text) {
  return { text, type: 3, isComment: true }
}

function createVdom(vm, code) {
  const f = new Function('vm', `with(vm){return ${code}}`)
  return f({ ...vm, _c, _s, _v, _l, _e })
}

function vnodeToHTML(vnode) {
  let root = document.createDocumentFragment();
  if (vnode.type === 3) {
    root.appendChild(document.createTextNode(vnode.text));
    return root;
  }
  if (vnode.type === 1) {
    let dom = document.createElement(vnode.tag);
    if (vnode.data) {
      Object.keys(vnode.data).forEach(item => {
        dom.setAttribute(item, vnode.data[item]);
      })
    }
    vnode.children.forEach(item => {
      dom.appendChild(vnodeToHTML(item));
    })
    root.appendChild(dom);  
  }
  return root;
}

/* 
_c('div',{"class":"newslist",},
info.showImage ? _c('div',{"class":"img",},_c('img',{"src": image,},)): _e(''),
info.showDate ? _c('div',{"class":"date",},_v(_s(info.name))): _e(''),
confirm ? _c('div',{"class":"date",},_v(_s(info.name))): _e(''),
_l((list),function(item){return _c('div',{"class":"img",},_v(_s(info.name)))}))
 */





let func = new Function(`let a = 0; console.log(a)`);
func()





