/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-11-14 13:27:30
 * @LastEditors: kexi
 * @LastEditTime: 2021-11-14 13:44:24
 */
/* var binaryTreePaths = function(root) {
  const paths = [];
  const construct_paths = (root, path) => {
      if (root) {
          path += root.val.toString();
          if (root.left === null && root.right === null) { // 当前节点是叶子节点
              paths.push(path); // 把路径加入到答案中
          } else {
              path += "->"; // 当前节点不是叶子节点，继续递归遍历
              construct_paths(root.left, path);
              construct_paths(root.right, path);
          }
      }
  }
  construct_paths(root, "");
  return paths;
}; */

var binaryTreePaths = function(root) {
    let result = []
    function cal(node,pre){ //pre记录已遍历节点
        if(node){
            if(pre == ''){
                pre+=node.val
            }else{
                pre+=('->'+node.val)
            }
            if(node.left && !node.right){
                cal(node.left,pre)
            }else if(!node.left && node.right){
                cal(node.right,pre)
            }else{
                cal(node.left,pre)
                cal(node.right,pre)
            }
        }else{
            if(result.indexOf(pre)==-1){
                result.push(pre)  //最后一个节点push2次 做去重
            }
        }
    }
    cal(root,'')
    return result
};

const root = [1,2,3,null,5]

binaryTreePaths(root);