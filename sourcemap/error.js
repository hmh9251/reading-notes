/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-10-26 18:13:06
 * @LastEditors: kexi
 * @LastEditTime: 2021-10-26 18:13:06
 */
import ErrorStackParser from "error-stack-parser";
class Sentry {
  constructor(Vue) {
    console.log("start Sentry");
    this.listenError();
    this.listenPromiseError();
    this.listenVueError(Vue);
  }

  listenError() {
    window.addEventListener('error', err => {
      console.log('listerError');
      const e = this.parseStackTrack(err.error.stack, err.error.message);
      console.log(e);
    }, true)
  }

  listenPromiseError() {
    window.addEventListener("unhandledrejection", e => {
      console.log('listenPromiseError');
      throw e.reason;
    });
  }

  listenVueError(Vue) {
    let that = this;
    Vue.config.errorHandler = (err, vm, info) => {
      console.log('vue errorHandler');
      const e = that.parseStackTrack(err.stack, err.message);
      console.log(e);
    }
  }

  parseStackTrack(stack, message) {
    const error = new Error(message);
    error.stack = stack;
    const stackFrame = ErrorStackParser.parse(error);
    return stackFrame
  }
}

export default Sentry;