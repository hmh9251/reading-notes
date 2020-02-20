(function(){
  const allTimer = 4.5, //摇一次总时间
    once = (allTimer / 3) * 1000;
    type = ['x', '—', '- -', 'o'],
    yao = {
      'x': '— —',
      '—': '———',
      '- -': '— —',
      'o': '———'
    },
    yingbiItems = document.querySelectorAll(".yingbi-item"),
    reng = document.querySelector("#reng"),
    resultsDom = document.querySelector(".results"),
    bagua = document.querySelector(".bagua");


  let results = [];

  function init() {
    reng.addEventListener("click",e => {
      let result = 0;
      let promises = {
        0: null,
        1: null,
        2: null,
        length: 3
      }
      Array.prototype.slice.call(yingbiItems).forEach((item, index) => {
        let r = random()
        result += r;
        promises[index] = animate(item, r, index);
      })
      results.push(result);
      Promise
        .all(Array.prototype.slice.call(promises))
        .then(() => {
          render();
        })
    })
  }

  function animate(item, res, index) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let timer = setInterval(() => {
          item.classList.toggle('animate');
        }, 100);
    
        setTimeout(() => {
          clearInterval(timer);
          item.classList.toggle('animate', res === 1);
          resolve();
        }, once);
      }, once * index);
    })
  }

  function random() {
    return Math.round(Math.random());
  }

  function render() {
      let div = document.createElement('div');
      div.className = "results-item";
      div.innerText = type[results.slice(-1)];
      resultsDom.appendChild(div);
      if (results.length === 6) {
      let r = results.reverse();
      r.forEach(item => {
        let div = document.createElement('div');
        div.className = "bagua-item";
        div.innerText = yao[type[item]];
        bagua.appendChild(div);
      })
    }
    
  }

  init();
})()