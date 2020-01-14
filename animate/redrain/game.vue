<style lang="scss" scoped>
.redrain-game {
  height: 100vh;
  background-image: url("./img/bg2@2x.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: relative;
  overflow: hidden;
  .count-down {
    background-image: url("./img/countdown@2x.png");
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 200px;
    height: 270px;
    font-size: 100px;
    font-weight: 500;
    color: #f4cb8f;
    line-height: 330px;
  }
  .redNum {
    position: absolute;
    top: 102px;
    right: 23px;
    width: 69px;
    height: 69px;
    background: rgba(199, 29, 8, 1);
    border: 2px solid rgba(244, 203, 143, 1);
    border-radius: 50%;
    font-size: 38px;
    font-weight: 500;
    color: #f4cb8f;
    line-height: 69px;
  }
  .red_packet {
    i {
      width: 125px;
      height: 162px;
      display: block;
      &.defaul {
        background: url("./img/redpack@2x.png") no-repeat center;
        background-size: contain;
      }
      &.fail {
        background: url("./img/redopen@2x.png") no-repeat center;
        background-size: contain;
      }
      &.success {
        background: url("./img/redopen@2x.png") no-repeat center;
        background-size: contain;
      }
    }
    li {
      position: absolute;
      z-index: 3;
      &.package {
        top: -100px;
      }
    }
    a {
      display: block;
    }
  }
  .result {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-image: url("./img/resultBg@2x.png");
    background-size: 100% 100%;
    line-height: 100vh;
    .top,
    .bottom {
      width: 100%;
      position: absolute;
    }
    .top {
      top: -80px;
      left: -40px;
    }
    section {
      background-image: url("./img/result.gif");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      position: absolute;
      line-height: 40px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100vw;
      height: 60vh;
      margin: auto;
      article {
        position: absolute;
        top: 350px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 500px;
        height: 300px;
        .subtitle {
          font-size: 33px;
          font-weight: 500;
          color: #fee47b;
        }
        .no-gain {
          font-size: 33px;
          font-weight: 500;
          color: #fee47b;
          line-height: 150px;
        }
        .content {
          font-size: 76px;
          line-height: 90px;
          font-weight: 900;
          color: #fee47b;
          span {
            display: inline-block;
            vertical-align: top;
          }
          .gold {
            width: 83px;
            vertical-align: top;
            margin-left: 10px;
          }
          .ticket {
            width: 200px;
            vertical-align: top;
          }
        }
        .action {
          img {
            width: 280px;
          }
        }
        .tips {
          font-size: 20px;
          font-weight: normal;
          color: #a20407;
          line-height: 29px;
          span {
            color: #fee47b;
          }
        }
      }
    }
  }
}
#game {
  width: 100vw;
  height: 100vh;
}
</style>
<template>
  <div class="redrain-game">
    <div class="count-down" v-if="secondMask">{{ second }}</div>
    <div v-if="!secondMask">
      <div class="redNum">{{ duration }}</div>
      <canvas id="game"></canvas>
    </div>
    <div class="result" v-if="end">
      <section>
        <article v-if="result.type === 0">
          <p class="no-gain">很遗憾,您没有中奖</p>
          <div class="action">
            <img @click="shareUrl" src="./img/button2@2x.png" alt="">
          </div>
        </article>
        <article v-else>
          <p class="subtitle">恭喜您获得</p>
          <div class="content">
            <template v-if="result.type === 1">
              <img class="ticket" :src="getTicket(result.quota)" alt="">
            </template>
            <template v-else>
              <span>{{result.quota}}</span>
              <img class="gold" src="./img/gold@2x.png" alt="">
            </template>
          </div>
          <div class="action">
            <img @click="shareUrl" src="./img/button2@2x.png" alt="">
          </div>
          <p class="tips">已存入您的钱包</p>
          <p class="tips">请前往<span>“我的-我的钱包”</span>查看</p>
        </article>
      </section>
    </div>
  </div>
</template>
<script>
import double from "./img/double@2x.png";
import tenfold from "./img/tenfold@2x.png";
import axios from "axios";
import { has, hasIn } from "lodash";
import Velocity from "velocity-animate";
import { fabric } from 'fabric';
import redpack from "./img/redpack@2x.png";

export default {
  name: "redrain-game",
  data() {
    return {
      second: 3, // 倒计时
      secondMask: true, //倒计时弹层
      liParams: [], // 红包数组
      timer: null,
      duration: 10, // 持续时间
      selectedNum: 0, // 选中红包个数，不超过3个
      clickNum: 0, // 点击的次数
      randomNum: Math.ceil(Math.random() * 6), // 1~6
      couponArr: [],
      end: false,
      requestRoll: false,
      canvas: null,
      result: {
        type: 0,
        quota: 0,
        rolled: false
      }
    };
  },
  computed: {
    gold() {
      return gold;
    }
  },
  created() {
    this.countDownFn();
  },
  mounted() {
    
  },
  methods: {
    getTicket(n) {
      return n === 2 ? double : tenfold;
    },
    shareUrl() {
      const url = "https://tazai-new.visvachina.com/download",
        title = "年终红包抽奖",
        content = "",
        imgUrl = ""
      if (has(window, "android.showSharePicDialog")) {
          window.android.showShareLinkDialog(url, title, content, imgUrl);
        } else if (hasIn(window, "webkit.messageHandlers.iOSAPI.postMessage")) {
          window.webkit.messageHandlers.iOSAPI.postMessage({
            key: "share",
            url: url,
            title: title,
            content: content,
            imgUrl: imgUrl
          });
        }
    },
    async roll() {
      const { code, data } = await axios.get("/visva/api-activity/lottery/roll");
      if (code === "000000") {
        this.result = data;
      }
    },
    countDownFn() {
      let self = this;
      let timer = setInterval(() => {
        if (self.second == 1) {
          self.secondMask = false;
          clearInterval(timer);
          self.startRedPacket();
          self.countDownFn10();
        } else {
          self.second--;
        }
      }, 1000);
    },
    countDownFn10() {
      let self = this;
      let timer = setInterval(() => {
        if (self.duration == 0) {
          clearInterval(timer);
          this.end = true;
        } else {
          self.duration--;
        }
      }, 1000);
    },
    tap(item) {
      if (!this.requestRoll) {
        this.roll();
        this.requestRoll = true;
      }
      this.clickNum++;
      if (this.selectedNum >= 3 && item.status == 0) {
        item.status = 2;
      }

      if (this.clickNum == this.randomNum) {
        if (item.status == 0 && this.selectedNum < 3) {
          this.randomNum = Math.ceil(Math.random() * 6);
          this.clickNum = 0;
          this.selectedNum++;
          item.status = 1;
        }
      } else {
        item.status = 2;
      }
    },
    startRedPacket() {
      this.$nextTick(() => {
        if (!this.canvas) {
          this.canvas =new fabric.Canvas('game', {
            height: 800, // 让画布同视窗大小
            width: window.innerWidth, 
            selection: false
          });
        }
      })
      let win =
        document.documentElement.clientWidth || document.body.clientWidth;
      let rotate = parseInt(Math.random() * 90 - 45); // 旋转角度
      // let w = Math.random() * 90 + 60;
      let scale = Math.random() / 10 * 3 + 0.2;
      let durTime = parseInt(Math.random() * 1.5) + 2.5; // 时间

      let left = parseInt(Math.random() * win);
      if (left < 0) {
        left = 0;
      } else if (left > win - 130) {
        left = win - 130;
      }

      fabric.Image.fromURL(redpack, oImg => {
        oImg.scale(scale).set({
          angle: rotate,
          left: left
        });
        this.canvas.add(oImg);
        oImg.animate('top', 1300,  {
          duration: durTime * 1000,
          onChange: this.canvas.renderAll.bind(this.canvas),
          onComplete: () => {
            this.canvas.remove(oImg);
          }
        });
        oImg.on('drop', e => {
          console.log(e);
        })
      })

      setTimeout(() => {
        // 多少时间结束
        clearTimeout(this.timer);
        return false;
      }, this.duration * 1000);

      // 红包密度
      this.timer = setTimeout(() => {
        this.startRedPacket();
      }, 300);
    },
    removeDom(e) {
      let target = e.currentTarget;
      document.querySelector("#red_packet").removeChild(target);
    }
  }
};
</script>
