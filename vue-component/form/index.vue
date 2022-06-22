<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2020-07-21 15:56:27
 * @LastEditors: kexi
 * @LastEditTime: 2021-03-30 12:12:12
-->
<template>
  <div class="c-form" :class="{ close: close }">
    <h3>
      数据筛选
      <div style="float: right;margin-top: -10px">
        <el-button v-if="advsearch" type="text" @click="dialogVisible = true">高级搜索</el-button>
        <el-button @click="close = !close">收起</el-button>
      </div>
    </h3>
    <page-form
      :field-list="fieldList"
      :data="data | formDataFilter"
      :ref-obj.sync="refObj"
      size="mini"
      labelWidth="100px"
    >
      <template v-for="item in fieldList" :slot="'form-' + item.value">
        <slot v-if="item.type === 'slot'" :name="'form-' + item.value" />
      </template>
    </page-form>
    <div class="c-form__action">
      <el-button type="primary" size="mini" @click="$emit('search', 'search')"
        >查询</el-button
      >
      <el-button size="mini" @click="reset">重置</el-button>
    </div>

    <el-dialog
      title="高级搜索"
      :visible.sync="dialogVisible"
      width="800px">
      <page-form
        :field-list="moreField"
        :data="data | formDataFilter"
        size="mini"
        labelWidth="100px"
      >
        <template v-for="item in moreField" :slot="'form-' + item.value">
          <slot v-if="item.type === 'slot'" :name="'form-' + item.value" />
        </template>
      </page-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="reset">清空条件</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeDialogAndSearch">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pageForm from './form';
import { cloneDeep } from 'lodash';
export default {
  name: 'CForm',
  components: {
    pageForm
  },
  props: {
    // 表单数据
    data: {
      type: Object,
      default: () => {}
    },
    // 相关字段
    fieldList: {
      type: Array,
      default: () => []
    },
    advsearch: {
      type: Boolean,
      default: false
    },
    moreField: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      refObj: null,
      close: false,
      cache: cloneDeep(this.data),
      
    };
  },
  methods: {
    reset() {
      this.refObj.resetFields();
      this.$nextTick(() => {
        Object.keys(this.cache).forEach(item => {
          this.$set(this.data, item, this.cache[item]);
        });
      });
      this.$emit('reset');
    },
    closeDialogAndSearch() {
      this.dialogVisible = false;
      this.$emit('search');
    }
  },
  filters: {
    // 过滤搜索字段
    formDataFilter: function(data = {}) {
      for (const [key, value] of Object.entries(data)) {
        if (!value && value !== 0) {
          Reflect.deleteProperty(data, key);
        }

        if (key === 'time') {
          if (value && value instanceof Array && value.length > 1) {
            data.startTime = new Date(value[0]).getTime();
            data.endTime = new Date(value[1]).getTime();
          } else {
            Reflect.deleteProperty(data, 'startTime');
            Reflect.deleteProperty(data, 'endTime');
            Reflect.deleteProperty(data, key);
          }
        }

        if (key === 'createdTime') {
          if (value && value instanceof Array && value.length > 1) {
            data.createdTimeSta = new Date(value[0]).getTime();
            data.createdTimeEnd = new Date(value[1]).getTime();
          } else {
            Reflect.deleteProperty(data, 'createdTimeSta');
            Reflect.deleteProperty(data, 'createdTimeEnd');
            Reflect.deleteProperty(data, key);
          }
        }

        if (key === 'addTime') {
          if (value && value instanceof Array && value.length > 1) {
            data.addTimeS = new Date(value[0]).getTime();
            data.addTimeE = new Date(value[1]).getTime();
          } else {
            Reflect.deleteProperty(data, 'addTimeS');
            Reflect.deleteProperty(data, 'addTimeE');
            Reflect.deleteProperty(data, key);
          }
        }

        if (key === 'releaseTime') {
          if (value && value instanceof Array && value.length > 1) {
            data.releaseS = new Date(value[0]).getTime();
            data.releaseE = new Date(value[1]).getTime();
          } else {
            Reflect.deleteProperty(data, 'releaseS');
            Reflect.deleteProperty(data, 'releaseE');
            Reflect.deleteProperty(data, key);
          }
        }

        if (key === 'pushTime') {
          if (value && value instanceof Array && value.length > 1) {
            data.pushStartTime = new Date(value[0]).getTime();
            data.pushEndTime = new Date(value[1]).getTime();
          } else {
            Reflect.deleteProperty(data, 'pushStartTime');
            Reflect.deleteProperty(data, 'pushEndTime');
            Reflect.deleteProperty(data, key);
          }
        }
      }
      return data;
    }
  }
};
</script>
<style lang="scss" scoped>
.c-form {
  background-color: white;
  padding: 20px;

  &.close {
    height: 62px;
    overflow: hidden;
  }

  h3 {
    color: #303133;
    padding: 10px 0;
    margin: 0 0 10px 0;
    border-bottom: 1px solid #dcdfe6;
  }

  &__action {
    text-align: right;
    margin: 0 90px;
  }
}
</style>
