<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 14:50:30
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-03 16:38:52
-->
<template>
  <div class="list">
    <book name="乡土中国"></book>
  </div>
</template>
<script>
import Book from '@/components/book.vue';
export default {
  components: {
    Book
  }
}
</script>
<style>
.list .book-component h1{
  background: #E6A23C;
}
</style>