class Redrain {
  constructor(selector, top, timer) {
    let win =
        document.documentElement.clientWidth || document.body.clientWidth;
    let left = parseInt(Math.random() * win);
    let tag = document.createElement("div"); 
    console.log(left);
    tag.className = "redrain";
    tag.style.left = left + 'px';
    this.tag = tag;
    this.parent = document.querySelector(selector);
    this.top = top;
    this.initTop = 0;
    
    this.speed = 500 / ((timer * 1000) / (1000 / 60));

  }

  start() {
    this.insertTag();
    this.go();
  }

  insertTag() {
    this.parent.appendChild(this.tag);
  }

  animation() {
    this.tag.style.top = this.initTop + 'px';
  }

  go() {
    this.initTop += this.speed;
    if (this.initTop > this.top) {
      return false;
    }
    this.animation();
    requestAnimationFrame(this.go.bind(this));
  };

}