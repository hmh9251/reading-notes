/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-06 16:27:45
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-06 16:47:29
 */
// micro-app-vue/src/shared/actions.js
/* function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn("Current execute action is empty!");
} */

class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: null,
    setGlobalState: null
  };
  
  /**
   * 设置 actions
   */
  setActions(actions) {
    this.actions = actions;
  }

  /**
   * 映射
   */
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }

  /**
   * 映射
   */
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();
export default actions;
