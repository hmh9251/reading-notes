(function(global) {
  var modules = {}, //加载完毕的所有模块
    loadings = [], //所有已加载模块的id
    basepath = 'http://127.0.0.1:5500/chapter2/';

  global.require = function(deps, callback) {
    var id = '_@';
    modules[id] = {
      id: id,
      deps: getDepsIds(deps),
      callback: callback,
      exports: null,
      status: 1
    };

    loadings.unshift(id);
    loadDepsJs(id);
  };

  global.define = function(deps, callback) {
    var id = getCurrentJs();
    modules[id] = {
      id: id,
      deps: getDepsIds(deps),
      callback: callback,
      exports: null,
      status: 1
    };
  };

  function getCurrentJs() {
    return document.currentScript.src;
  }

  function getDepsIds(arr) {
		return arr.map(item => {
			return basepath + item + '.js'
		})
	}

  function loadDepsJs(id) {
    var myModule = modules[id];
    if (myModule) {
      myModule.deps.forEach(function(item) {
        loadJs(item, function() {
          loadings.unshift(item);
          loadDepsJs(item);
          checkDeps();
        });
      });
    }
  }

  function loadJs(url, callback) {
    var node = createNode();
    node.src = url;
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

  function createNode(params) {
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.async = true;
    return node;
  }

  checkDeps = function checkDeps() {
    console.log(loadings);
    for (var i = 0, id; i < loadings.length; i++) {
      
      id = loadings[i];
      if (!modules[id]) continue;
      
      var obj = modules[id],
      deps = obj.deps;
      // console.log(id, deps, '准备开始检测');
      

      var flag = checkCycle(deps);

      if(loadings.length === 1 && id === '_@') flag = true;

      if (flag) {
        console.log(i, loadings[i], '全部依赖已经loaded');

        loadings.splice(i, 1);
        // ！！！运行模块，然后同时得到该模块的返回值！！！
        getExport(obj.id);
        // 不断的循环探查啊~~~~
        checkDeps();
      }
    }
  }

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

  function getExport(id) {
   
    var params = [];
    var deps = modules[id].deps;

    for (var i = 0; i < deps.length; i++) {
      let depId = deps[i];
      params.push(modules[depId].exports);
    }

    if (!modules[id].exports) {
      modules[id].exports = modules[id].callback.apply(global, params);
    }
  }
})(window);
