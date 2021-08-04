<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-03 10:53:58
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-03 16:36:15
-->
<template>
  <article class="book-component">
    <h1>{{ name }}</h1>
    <p v-for="item in random()" :key="item">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum eveniet eaque exercitationem expedita ex officiis nihil laudantium accusantium nemo neque quasi voluptate dignissimos recusandae quo excepturi, quidem debitis consectetur dolor?
    </p>
  </article>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    }
  },
  methods: {
    random() {
      return parseInt(Math.random() * 10) + 3;
    }
  }
}
</script>
<style>
.book-component {
  text-align: center;
}
</style>