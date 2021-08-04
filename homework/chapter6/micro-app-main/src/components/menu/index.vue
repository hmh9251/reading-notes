<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 10:06:02
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-03 10:45:54
-->
<template>
  <section class="cns-main-menu">
    <h1>在线图书馆</h1>
    <ul>
      <li v-for="item in menus" :key="item.key">
        <router-link :to="{path: item.path }">
          <span>{{item.title}}</span>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      require: true
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.cns-main-menu {
  width: 256px;
  height: 100vh;
  border: 10px solid #000;
  h1 {
    text-align: center;
  }
  ul {
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    list-style: none;
  }
  li {
    background: #909399;
    text-align: center;
    color: #303133;
    height: 50px;
    line-height: 50px;
    border-radius: 20px;
    margin: 20px 0;
  }
}
</style>