/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-07-30 16:36:15
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-03 10:27:25
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import startQiankun from "./micro";

Vue.config.productionTip = false

startQiankun();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
