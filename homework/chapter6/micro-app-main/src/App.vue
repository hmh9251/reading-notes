<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-07-30 16:36:15
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-06 16:26:50
-->
<template>
  <section class="cns-main-app">
    <section class="cns-menu-wrapper">
      <main-menu :menus="menus" />
    </section>
    <section class="cns-frame-wrapper">
      <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
      <router-view v-show="$route.name" />

      <!-- 子应用渲染区，用于挂载子应用节点 -->
      <section v-show="!$route.name" id="frame"></section>
    </section>
  </section>
</template>
<script>
import MainMenu from "@/components/menu/index.vue";
import actions from "@/shared/actions";

export default {
  components: {
    MainMenu,
  },
  created() {
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      console.log("主应用观察者：token 改变前的值为 ", prevState.token);
      console.log("主应用观察者：登录状态发生改变，改变后的 token 的值为 ", state.token);
    });
    let token = "jfhqfljfekjfjfjvhgjhgjfe";
    actions.setGlobalState({ token });
  },
  data() {
    return {
      menus: [
        {
          key: "Home",
          title: "欢迎来到图书馆",
          path: "/",
        },
        {
          key: "VueMicroApp",
          title: "vueMicro-斗破苍穹",
          path: "/vue",
        },
        {
          key: "VueMicroAppList",
          title: "vueMicro-乡土中国",
          path: "/vue/list",
        },
        {
          key: "ReactMicroApp",
          title: "reactMicro-神墓",
          path: "/react",
        },
        {
          key: "ReactMicroAppList",
          title: "reactMicro-吞噬星空",
          path: "/react/about",
        },
      ],
    };
  },
};
</script>

<style lang="less">
html, body {
  padding: 0;
  margin: 0;
}
.cns-main-app {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.cns-frame-wrapper {
  border: 10px solid #000;
  height: 100vh;
  width: 100%;
}
</style>
