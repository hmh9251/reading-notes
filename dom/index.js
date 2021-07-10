/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-01-13 17:02:07
 * @LastEditors: kexi
 * @LastEditTime: 2021-01-13 17:44:33
 */

const body = document.body;
/* 
function traversalUsingNodeIterator(node){
  var iterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT,null,false);
  var node = iterator.nextNode();
  while(node != null){
    
    if (node && node.nodeType === 3) {
      // node.textContent = node.textContent.replace("set", "<span>tes</span>");
      node.parentNode.innerHTML = node.textContent.replace("set", "<span>seta</span>");
      break;
    }
    node = iterator.nextNode();
  }
}

traversalUsingNodeIterator(body); */

function deepNode(ele) {
  const childNodes = ele.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes[i];
    if (childNode.nodeType === 3) {
      let test = childNode.nodeValue;
      this.list.forEach((item) => {
        test = test.replaceAll(item, `<b style="color:red;">${item}</b>`);
      });
      childNode.parentNode.innerHTML = test;
      break;
    }
    deepNode(childNode);
  }
}


