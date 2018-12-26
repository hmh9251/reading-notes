var class2type = {
  "[objectHTMLDocument]": "Document",
  "[objectHTMLCollection]": "NodeList",
  "[objectStaticNodeList]": "NodeList",
  "[objectIXMLDOMNodeList]": "NodeList",
  "[objectDOMWindow]": "Window",
  "[object global]": "Window",
  "null": "Null",
  "NaN": "NaN",
  "undefined": "Undefined"
},
toString = class2type.toString;

var str = "Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList"
  .replace(/[a-zA-Z]+/g, function(name) {
    class2type[ "[object " +name+ "]" ] = name;
  })

function type(obj, str) {  
  var result = class2type[ (obj == null || obj !== obj) ? obj : toString.call(obj) ] || obj.nodeName || "#";

  if(result.charAt(0) === '#') {
    if(obj == obj.document && obj.document != obj) {
      result = 'Window';
    } else if(obj.nodeType === 9) {
      result = 'Document';
    } else if(obj.callee) {
      result = 'Arguments';
    } else if(isFinite(obj.length) && obj.item) {
      result = 'NodeList';
    } else {
      result = toString.call(obj).slice(8, -1);
    }
  }
  if(str) return str === 'result';

  return result;
}

var a = "1";
console.log(type(a));