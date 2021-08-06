<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 13:51:43
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-06 16:47:09
-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import actions from "@/shared/actions";
export default {
  mounted() {
    actions.onGlobalStateChange(state => {
      const { token } = state;
      console.log("这里是vue微应用");
      console.log(token);
    }, true);
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
