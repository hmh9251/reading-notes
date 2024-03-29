<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2022-01-26 10:49:57
 * @LastEditors: kexi
 * @LastEditTime: 2022-01-26 10:54:11
-->
<template>
  <el-form
    class="t-form"
    ref="form"
    :class="className"
    :model="formOpts.formData"
    :rules="formOpts.rules"
    :label-width="formOpts.labelWidth||'120px'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-form-item
      v-for="(item, index) in formOpts.fieldList"
      :key="index"
      :prop="item.value"
      :label="item.label"
      :class="[item.className,{'render_label':item.labelRender},{'slot_label':item.slotName}]"
      :rules="item.rules"
      :style="{ width: `${100 / (item.widthSize || colSize)}%` }"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <!-- 自定义label -->
      <template #label v-if="item.labelRender">
        <render-comp :createElementFunc="item.labelRender" />
      </template>
      <!-- 自定义输入框插槽 -->
      <template v-if="item.slotName">
        <slot :name="item.slotName"></slot>
      </template>
      <component
        v-else
        :is="item.comp"
        v-model="formOpts.formData[item.value]"
        :type="item.type"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, formOpts.formData[item.value])"
        v-bind="{clearable:true,filterable:true,...item.bind}"
        style="width: 100%"
      >
        <!-- 前置文本 -->
        <template #prepend v-if="item.prepend">{{ item.prepend }}</template>
        <!-- 后置文本 -->
        <template #append v-if="item.append">{{ item.append }}</template>
        <component
          :is="compChildName(item)"
          v-for="(value, key, index) in formOpts.listTypeInfo[item.list]"
          :key="index"
          :disabled="value.disabled"
          :label="item.type === 'select-obj'? value: item.type === 'checkbox'? value.value: value[item.arrLabel]"
          :value="item.type === 'select-obj'? key : item.type === 'checkbox' ? value.value : value[item.arrKey]"
        >{{ item.type === 'checkbox' ? value.label : item.type === 'select-arr'?value[item.arrLabel]:item.type === 'select-obj' ? value :'' }}</component>
      </component>
    </el-form-item>
    <!-- 按钮 -->
    <div
      class="flex-box flex-ver t-margin-top-5"
      v-if="formOpts.operatorList&&formOpts.operatorList.length>0"
    >
      <el-button
        v-for="val in formOpts.operatorList"
        :key="val.label"
        @click="val.fun(val)"
        :type="val.type"
        :icon="val.icon"
        :size="val.size || 'medium'"
      >{{ val.label }}</el-button>
    </div>
  </el-form>
</template>
<script>
import RenderComp from './render-comp.vue';
export default {
  name: 'TSimpleForm',
  components: {
    RenderComp
  },
  props: {
    // 自定义类名
    className: {
      type: String
    },
    /** 表单配置项说明
     * formData object 表单提交数据
     * rules object 验证规则
     * fieldList Array 表单渲染数据
     * operatorList Array 操作按钮list
     * listTypeInfo object 下拉选项数据
     * labelWidth  String label宽度
     */
    formOpts: {
      type: Object,
      default: () => ({})
    },
    // 一行显示几个输入项;最大值4
    widthSize: {
      type: Number,
      default: 2,
      validator: (value) => {
        return value <= 4
      }
    },
    // ref
    refObj: {
      type: Object
    }
  },
  computed: {
    // 子组件名称
    compChildName () {
      return ({ type }) => {
        switch (type) {
          case 'checkbox':
            return 'el-checkbox'
          case 'select-arr':
          case 'select-obj':
            return 'el-option'
        }
      }
    }
  },
  data () {
    return {
      colSize: this.widthSize
    }
  },
  watch: {
    'formOpts.formData': {
      handler (val) {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true // 深度监听
    },
    widthSize (val) {
      if (val > 4) {
        this.$message.warning('widthSize值不能大于4！')
        this.colSize = 4
      } else {
        this.colSize = val
      }
    }
  },
  mounted () {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
  methods: {
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder
      // 请输入type
      const inputArr = ['input', 'textarea']
      // 请选择type
      const selectArr = ['select-arr', 'time', 'select-obj', 'date']
      if (inputArr.includes(row.type)) {
        placeholder = '请输入' + row.label
      } else if (selectArr.includes(row.type)) {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 绑定的相关事件
    handleEvent (type, val) {
      // console.log('组件', type, val)
      this.$emit('handleEvent', type, val)
    },
    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              valid,
              formData: this.formOpts.formData
            })
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              valid,
              formData: null
            })
          }
        })
      })
    },
    // 重置表单
    resetFields () {
      return this.$refs.form.resetFields()
    },
    // 清空校验
    clearValidate () {
      return this.$refs.form.clearValidate()
    }
  }
}
</script>
<style lang="scss">
.t-form {
  .el-form-item {
    display: inline-block;
    width: 50%;
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-date-editor,
      .el-textarea {
        width: 100%;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }
  .t-margin-top-5 {
    margin-top: calc(5px);
  }
  .t-form-block {
    display: block;
    width: 100% !important;
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-date-editor,
      .el-textarea {
        width: 100%;
      }
    }
  }
  .render_label {
    .el-form-item__label {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &::before {
        margin-top: 1px;
      }
    }
  }
  .label_render {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .slot_label {
    .el-form-item__content {
      // margin-left: 0 !important;
      label {
        min-width: 108px;
        color: #606266;
        text-align: right;
        margin-right: 12px;
      }
    }
  }
}
</style>



</style>


