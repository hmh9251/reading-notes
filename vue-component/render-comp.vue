<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2022-01-26 10:51:24
 * @LastEditors: kexi
 * @LastEditTime: 2022-01-26 10:51:46
-->
<script>
export default {
  name: 'RenderComp',
  props: {
    createElementFunc: Function
  },
  render (h) {
    return this.createElementFunc(h)
  }
}
</script>

