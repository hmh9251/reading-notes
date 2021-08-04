/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 13:51:43
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-02 15:34:57
 */
import Vue from 'vue'
import App from './App.vue'
import routes from './router'
import VueRouter from 'vue-router';
import './public-path.js'

Vue.config.productionTip = false

Vue.use(VueRouter);

let instance = null;
let router = null;

function render() {
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/vue/' : '/',
    mode: 'history',
    routes,
  });
  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
 export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
  // router = null;
}
