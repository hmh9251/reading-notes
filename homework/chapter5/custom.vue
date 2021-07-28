<template>
    <div>{{ msg }}
        <button @click="num++">点击这里,现在是{{ num }}次</button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'hello world',
                num: 0
            }
        }
    }
</script>