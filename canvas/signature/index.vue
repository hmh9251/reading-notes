<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-03-06 16:02:19
 * @LastEditors: kexi
 * @LastEditTime: 2021-04-13 18:30:09
-->
<template>
  <div class="protocol" ref="protocol">
    <h1>商户服务协议</h1>
    <section class="signature" @click="showSignature">
      <h4>点击此处签名确认</h4>
      <div class="signature-show">
        <img v-if="signature" :src="signature" alt="" />
      </div>
    </section>
    <section class="action">
      <button class="disabled" @click="$router.go(-1)">上一步</button>
      <button @click="printsceen">提交审核</button>
    </section>

    <div class="signature-pad" v-if="show">
      <div class="signature-pad__container">
        <h4>请在此处签名确认</h4>
        <div class="board" ref="board">
          <canvas ref="canvas" class="board__canvas"></canvas>
        </div>
        <div class="handle">
          <button class="reset" @click="clear">重新签名</button>
          <button class="complete" @click="getSignatureImg">完成</button>
        </div>
      </div>
      <div>
        <canvas ref="canvas2" width="380" height="200"></canvas>
      </div>
    </div>
    <!-- <img style="width:300px" :src="electronicProtocol" alt=""> -->
    <div class="loading" v-if="loading">
      <van-loading />
    </div>
  </div>
</template>
<script>
import SignaturePad from 'signature_pad';
import { dataURLtoFile, uploadImg } from '@/utils/downloadAndUpload';
import { mapState } from 'vuex';
import { setMerchantInfo } from './service';
import { Toast } from 'vant';
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      loading: false,
      show: false,
      signaturePad: null,
      signature: null,
      electronicProtocol: null
    };
  },
  computed: {
    ...mapState('recruitment', ['formData', 'phone', 'channelId'])
  },
  watch: {
    loading(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  methods: {
    showSignature() {
      this.show = true;
      this.$nextTick(() => {
        let board = this.$refs.board;
        let canvas = this.$refs.canvas;
        canvas.width = board.offsetWidth;
        canvas.height = board.offsetHeight;

        this.signaturePad = new SignaturePad(canvas, {
          backgroundColor: '#f2f2f2'
        });
      });
    },
    clear() {
      this.signaturePad.clear();
    },
    getSignatureImg() {
      if (this.signaturePad.isEmpty()) {
        return false;
      }
      this.loading = true;
      let base64 = this.signaturePad.toDataURL();
      let canvas = this.$refs.canvas2;
      let ctx = canvas.getContext('2d');
      let imgObj = new Image();
      imgObj.src = base64;
      //如果是伪横屏情况下，回显签名旋转
      imgObj.onload = async () => {
        ctx.translate(30, 150);
        //旋转中心移动到右侧中下方，构建出右侧一个正方形，旋转后只有左侧会超出屏幕
        ctx.rotate((270 * Math.PI) / 180);
        ctx.drawImage(imgObj, 10, 10, 100, 300);
        let newBase64 = canvas.toDataURL();
        let file = dataURLtoFile(newBase64);
        let { url } = await uploadImg(file, 'no-userid');
        this.signature = url;
        this.show = false;
        this.loading = false;
      };
    },
    async submit() {
      let shopName = this.formData.shopName.replace(/\s/g, '');
      const formData = {
        ...this.formData,
        shopName,
        channelId: this.channelId,
        electronicProtocol: [this.electronicProtocol],
        mobile: this.phone.mobile
      };
      const { errorCode, msg } = await setMerchantInfo(formData);
      if (errorCode === '00000') {
        Toast.success('提交成功');
        this.$router.push('/recruitment-result');
      } else {
        let message = msg.message;
        Toast.fail(message);
      }
    },
    printsceen() {
      if (!this.signature) {
        Toast.fail('请签名协议');
        return false;
      }
      this.loading = true;
      window.scrollTo(0, 0);
      html2canvas(this.$refs.protocol).then(async canvas => {
        let img = canvas.toDataURL();
        let file = dataURLtoFile(img);
        let { url } = await uploadImg(file, 'no-userid');
        this.electronicProtocol = url;
        this.submit();
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.protocol {
  padding: 40px;
  font-size: 28px;
  font-weight: 400;
  color: #666666;
  .title {
    font-size: 32px;
    color: #333333;
  }
  li {
    margin-bottom: 16px;
  }
  .signature {
    width: 660px;
    background: #f2f2f2;
    border-radius: 16px;
    padding: 32px 0 0 0;
    h4 {
      font-size: 32px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      margin: 0;
    }
    .signature-show {
      width: 600px;
      height: 250px;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
  }
  .action {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    button {
      width: 310px;
      height: 80px;
      background: linear-gradient(137deg, #ff8228 0%, #ff5110 100%);
      border-radius: 40px;
      font-size: 32px;
      font-weight: 600;
      color: #ffffff;
      border: none;
      &.disabled {
        background: #ddd;
      }
    }
  }
  .loading {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.signature-pad {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #fff;
  overflow: scroll;
  padding: 34px;
  &__container {
    background: #f2f2f2;
    border-radius: 39px;
    position: relative;
    height: 100%;
    h4 {
      font-size: 48px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 78px;
      margin: 0;
      text-align: center;
      transform: rotate(90deg);
      position: absolute;
      top: 0;
      bottom: 0;
      right: -100px;
      margin: auto;
      height: 78px;
    }
    .board {
      background: #333333;
      width: 400px;
      height: 100%;
      margin: auto;
      &__canvas {
        width: 400px;
        height: 100%;
        background: #f2f2f2;
      }
    }
    .handle {
      display: inline-block;
      text-align: center;
      margin-top: 10px;
      transform: rotate(90deg);
      position: absolute;
      top: 0;
      bottom: 0;
      left: -260px;
      margin: auto;
      height: 100px;
      button {
        width: 310px;
        height: 80px;
        background: #999999;
        border-radius: 40px;
        border: 0;
        font-size: 32px;
        font-weight: 600;
        color: #fff;
        + button {
          margin-left: 30px;
        }
        &.reset {
          background: #999999;
        }
        &.complete {
          background: linear-gradient(137deg, #ff8228 0%, #ff5110 100%);
        }
      }
    }
  }
}
</style>
