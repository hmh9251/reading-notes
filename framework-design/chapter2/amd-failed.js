
//本段代码借鉴网上的参考以及最后自己的思考 发现有很多漏洞 最终失败。。。。
(function(global, undefined) {
  var modules = {},
    loadDepsJs = [];

  function getCurrentJs() {
    return document.getCurrentJs ? document.getCurrentJs.src : '_@';
  }

  window.require = function(deps, callback) {
    var id = getCurrentJs(); //如果没有默认的data-main直接执行require那就给默认的模块名称为_@

    if (!modules[id]) {
      modules[id] = {
        id: id,
        deps: deps,
        callback: callback,
        exports: null,
        status: 1
      };
      loadDepsJs.unshift(id);
    }
    loadDeps(id);
  };

  window.define = function(deps, callback) {
    var id = getCurrentJs();
    if (!modules.id) {
      modules[id] = {
        id: id,
        deps: deps,
        callback: callback,
        exports: null,
        status: 1
      };
    }
    loadDeps(id);
  };

  function createNode(params) {
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.async = true;
    return node;
  }

  function loadJs(url, callback) {
    var node = createNode();
    node.src = url + '.js';
    node.setAttribute('data-id', url);
    node.addEventListener(
      'load',
      function(evt) {
        var e = evt.target;
        setTimeout(function() {
          callback && callback(e);
        }, 1000);
      },
      false
    );
    document.body.appendChild(node);
  }

  function loadDeps(id) {
    var module = modules[id];

    if (module) {
      module.deps.forEach(function(item) {
        if (!modules[item]) {
          loadJs(item, function() {
            loadDepsJs.unshift(item);
            loadDeps(item);
            checkDeps();
          });
        }
      });
    }
  }

  function checkDeps() {
    for (var i = 0, id; i < loadDepsJs.length; i++) {
      id = loadDepsJs[i];
      if (!modules[id]) continue;

      var obj = modules[id],
        deps = obj.deps;

      // 下面那行为什么要执行checkCycle函数呢，checkDeps是循环loadings数组的模块id，而checkCycle是去判断该id模块所依赖的**层级**的模块是否加载完
      // 即checkDeps是**广度**的循环已经加载（但依赖没完全加载完的）的id
      // checkCycle是**深度**的探查所关联的依赖
      // 还是举例吧。。。假如除了1.js, 2.js, 3.js, 还有个4.js，依赖5.js，那么
      // loadings 可能 是 ['1.js', '4.js']
      // 所以checkDeps --> 1.js，  4.js
      // checkCycle深入内部 1.js --> 2.js --> 3.js ;;; 4.js --> 5.js
      // 一旦比如说1.js的所有依赖2.js、3.js都加载完了，那么1.js 就会在loadings中移出

      var flag = checkCycle(deps);

      if (flag) {
        console.log(i, loadDepsJs[i], '全部依赖已经loaded');

        loadDepsJs.splice(i, 1);
        // ！！！运行模块，然后同时得到该模块的返回值！！！
        getExport(obj.id);
        // 不断的循环探查啊~~~~
        checkDeps();
      }
    }
  }

  // 深层次的递归的去判断，层级依赖是否都加在完了
  // 进入1.js的依赖2.js，再进入2.js的依赖3.js ......
  function checkCycle(deps) {
    var flag = true;

    function cycle(deps) {
      deps.forEach(item => {
        if (!modules[item] || modules[item].status == 1) {
          flag = false;
        } else if (modules[item].deps.length) {
          //                         console.log('inner deps', modules[item].deps);

          cycle(modules[item].deps);
        }
      });
    }

    cycle(deps);

    return flag;
  }

  /*
    运行该id的模块，同时得到模块返回值，modules[id].export
*/
function getExport(id) {
  /*
      先想一下，例如模块2.js, 这时 id == 2.js
      define(['3.js', 'xxxx.js'], functionA(B, C) {
          // B得到的就是3.js模块的返回值，C是xxxx.js的
          return aaaaa    // 2.js 模块的返回值
      })
      所以：
      1. 运行模块，就是运行 functionA （模块的callback）
      2. 得到模块的返回值，就是functionA运行后的返回值 aaaaa
      问题：
      1. 运行functionA(B, C)   B, C是什么？怎么来的？
      2. 有B, C 了，怎么运行functionA ？
      
  */
      // 解决问题1
      // B, C 就是该模块依赖 deps [3.js, xxxx.js]对应的返回值啊 
      // 那么循环deps 得到 依赖模块Id, 取模块的export。。。
     var params = [];
     var deps = modules[id].deps  
     
     for(var i = 0; i < deps.length; i++) {
          // 取依赖模块的exports即模块返回值，注意不要害怕取不到，因为你这个模块
          // 都进来打算运行了，那么你的所有依赖的模块早都进来过运行完了（还记得模块运行顺序不？）
          let depId = deps[i]
          params.push( modules[ depId ].exports ) 
          
     }
     
     // 到这里,params就是依赖模块的返回值的数组，也就是B，C对应的实参
     // 也就是 params == [3.js的返回值，xxxx.js的返回值]
     
     console.log(id);
     
     if(!modules[id].exports) {
          // 解决问题2： callback(functionA)的执行，用.apply，这也是为什么params是个数组了
          // 这一行代码，既运行了该模块，同时也得到了该模块的返回值exportgt
          console.log(params);
          modules[id].exports = modules[id].callback.apply(global, params)
          console.log(modules[id].exports);
     }
    
  }
  
})(window);
