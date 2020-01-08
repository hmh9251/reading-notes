let flow = null;
function getRect(className) {
  //将dom缓存起来
  !flow && (flow = document.querySelectorAll(className));
  
  /* 此等奇技淫巧不如for性能好
  Array.prototype.slice.call(flow).forEach(item => {
    let rect = item.getBoundingClientRect();
    setAnimate(item, rect.top);
  }) */
  for(let i = 0; i < flow.length; i++) {
    let item = flow[i];
    // let rect = item.getBoundingClientRect(); 赋值也会产生性能浪费
    setAnimate(item, item.getBoundingClientRect().top);
  }
}

function setAnimate(item, top) {
  let wHeight = window.innerHeight;
  let mid = wHeight / 2;
  let x = mid / 2; //在屏幕的四分之一处开始变化
  let rad = 0;
  if (top < -100 || top > (wHeight + 100)) return false;
  if (top < -50 || top > (wHeight + 50)) {
    item.style.transform =`scale(0.6, 0.6)`;
    return false;
  }
  item.style.visibility = "visible";
  let windowTop = document.body.scrollTop + document.documentElement.scrollTop;
  if (top < x) {
    rad = (top * (1 / x)) / 10 * 3 + 0.7;
    if (windowTop === 0) {
      item.style.transform =`scale(1,1)`;
      item.style.transition = "0.3s all";
      return false;
    } else {
      item.style.transform = `scale(${rad},${rad})`;
      item.style.transition = "";
    }
  } else if(top > (mid + mid/2)) {
    rad = ((wHeight - top) * (1 / x))  / 10 * 3 + 0.7;
    item.style.transform = `scale(${rad},${rad})`;
  } else {
    item.style.transform =`scale(1,1)`;
  }
}

/* function setAnimate(item, top) {
  let wHeight = window.innerHeight;
  let mid = wHeight / 2;
  let x = mid / 2; //在屏幕的四分之一处开始变化
  let rad = 0;
  if (top < -100 || top > (wHeight + 100)) return false;
  if (top < -50 || top > (wHeight + 50)) {
    item.style.visibility = "hidden";
    return false;
  }
  item.style.visibility = "visible";
  let windowTop = document.body.scrollTop + document.documentElement.scrollTop;
  if (top < x) {
    rad = 1.5 - top * (1.5 / x);
    if (windowTop === 0) {
      item.style.transform =`perspective(900px) rotateX(0rad)`;
      item.style.transition = "0.15s all";
      return false;
    } else {
      item.style.transform =`perspective(900px) rotateX(${rad}rad)`;
      item.style.transition = "";
    }
  } else if(top > (mid + mid/2)) {
    rad = 1.5 - (wHeight - top) * (1.5 / x);
    item.style.transform =`perspective(900px) rotateX(-${rad}rad)`;
  } else {
    item.style.transform =`perspective(900px) rotateX(0rad)`;
  }
} */