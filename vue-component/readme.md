# Vue组件化开发

## 什么是组件化
可复用的UI组件独立成公共的单个组件

## Vue组件化基础知识点归纳
1. vue单文件组件
2. 组件局部自定义-slot
3. 组件局部自定义-component
4. 组件递归

#### vue单文件组件
...略过

#### slot详解
文档地址[https://vuejs.bootcss.com/guide/components-slots.html]

#### component详解
文档地址[https://vuejs.bootcss.com/guide/components-dynamic-async.html]

#### 组件递归
就组件自己调用自己
```
<template>
  <div>
    {{ index }}
    <div class="childs" v-if="index < 10">
      <custom-component :index="index" ></custom-component>
    </div>
  </div>
</template>
<script>
import customComponent from "./customComponent"
export default {
  name: 'custom-component',
  props: {
    index: {
      type: Number,
      default: 1
    }
  },
  components: {
    'custom-component': customComponent
  }
}
</script>
```

## 组件封装的要点
1. 为什么要封装这个组件
  a. 偷懒，节省时间
  b. 一次性业务可以无需封装组件
  c. 代码量过大，可以抽离部分代码
  d. 形成高可用的通用UI组件
  e. 形成高可用的业务组件

2. 组件的粒度
  a. 粒度过小，比如一个标题一个组件，这种组件不如不写，写一个<h1>跟引用一个组件的时间差不多
  b. 粒度过大，比如一个页面一个组件，这种可用性很低
  c. 合适的粒度，比如一个table组件，一个card组件，form组件，每次调用只需要将从服务端获取的数据处理成对应的组件数据传入，就可以避免每次都重复开发编写大量的样式交互的代码

3. 组件的可复用性
  a. 大量的参数，参数越多越灵活，需要考虑的也就越多，但是在没有文档的情况下，调用起来也会异常复杂
  b. 少量的参数，参数越少越不灵活，可重用性就越低，但是在没有文档的情况下，调用起来比较简便
  c. 通过少量参数的组件，相互拼装
  d. 以上三点没有最优，只能在实践中不停的调整

## 封装一个table组件，代码实战。