

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
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const { tag, attrs, isClose } = parseStartTag() || {}
      if (tag) {
        start(tag, attrs);
        if (isClose) end(tag);
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTag) {
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
 */
function parseToHTML(AST, data) {
  let f = document.createDocumentFragment();
  let dom = null;
  if (AST.type === 1) {
    dom = parseTag(AST, data);
  } else if (AST.type === 3) {
    dom = parseText(AST, data)
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
  const func = new Function(`with(data){return ${exp}}`)
  return func();
}