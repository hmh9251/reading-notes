<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 14:49:38
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-03 16:38:05
-->
<template>
  <div class="home">
    <book name="斗破苍穹" ></book>
  </div>
</template>

<script>
import Book from "@/components/book.vue";
export default {
  name: 'Home',
  components: {
    Book
  },
}
</script>
<style>
.home .book-component{
  background: gray;
}
</style>