<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2020-07-21 15:56:27
 * @LastEditors: leoFan
 * @LastEditTime: 2021-12-08 13:09:09
-->
<template>
  <el-form
    ref="form"
    class="page-form"
    :class="className"
    :model="data"
    :rules="rules"
    :label-width="labelWidth"
    :size="size"
  >
    <el-form-item
      v-for="(item, index) in getConfigList()"
      :key="index"
      :prop="item.value"
      :label="item.label"
      :class="item.className"
    >
      <!-- slot -->
      <template v-if="item.type === 'slot'">
        <slot :name="'form-' + item.value" />
      </template>
      <!-- 普通输入框 -->
      <el-input
        v-if="
          item.type === 'input' ||
          item.type === 'password' ||
          item.type === 'number'
        "
        v-model="data[item.value]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :maxlength="item.length"
        @focus="handleEvent(item.event)"
      />
      <!-- 文本输入框 -->
      <el-input
        v-if="item.type === 'textarea'"
        v-model="data[item.value]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :maxlength="item.length"
        :autosize="item.autosize || { minRows: 2, maxRows: 10 }"
        @focus="handleEvent(item.event)"
      />
      <!-- 计数器 -->
      <el-input-number
        v-if="item.type === 'inputNumber'"
        v-model="data[item.value]"
        :min="item.min"
        :max="item.max"
        @change="handleEvent(item.event)"
      />
      <!-- 选择框 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="data[item.value]"
        :disabled="item.disabled"
        :clearable="item.clearable === false ? false : true"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, item.value, data[item.value])"
      >
        <el-option
          v-for="(childItem, childIndex) in item.list"
          :key="childIndex"
          :label="childItem.label"
          :value="childItem.value"
        />
      </el-select>
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="data[item.value]"
        type="datetime"
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-date-picker
        v-model="data[item.value]"
        type="month"
        v-if="item.type === 'month'"
        picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        value-format="yyyy-MM"
        >
      </el-date-picker>
      <!-- 日期范围选择框 -->
      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="data[item.value]"
        type="datetimerange"
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @focus="handleEvent(item.event)"
      />
      <!-- 信息展示框 -->
      <el-tag v-if="item.type === 'tag'">
        {{
          $fn.getDataName({
            dataList: listTypeInfo[item.list],
            value: 'value',
            label: 'key',
            data: data[item.value],
          }) || '-'
        }}
      </el-tag>

      <el-radio-group v-if="item.type === 'radio'" v-model="data[item.value]">
        <el-radio
          v-model="data[item.value]"
          :key="index"
          :change="handleEvent(item.event, item.value, data[item.value])"
          v-for="(radio, index) in item.radioList"
          :label="radio.label"
          >{{ radio.name }}</el-radio
        >
      </el-radio-group>

      <!-- 上传图片 -->
      <UploadImage
        v-if="item.type === 'image'"
        :params="item.imageParams"
        :formData.sync="data"
      />

      <!-- 上传文件 -->
      <UploadFile
        v-if="item.type === 'file'"
        :params="item.fileParams"
        :formData.sync="data"
      />

      <!-- 文字按钮 -->
      <el-button
        type="text"
        v-if="item.type === 'textButton'"
        @click="handleClick(item.event)"
      >
        {{ item.value }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import UploadImage from '@/components/upload-image';
import UploadFile from '@/components/upload-file';
import { emitHandleChange } from '@/event';
export default {
  name: 'PageForm',
  components: {
    UploadImage,
    UploadFile,
  },
  props: {
    // 自定义类名
    className: {
      type: String,
      default: '',
    },
    // 表单数据
    data: {
      type: Object,
      default: () => {},
    },
    // 相关字段
    fieldList: {
      type: Array,
      default: () => [],
    },
    // 验证规则
    rules: {
      type: Object,
      default: () => {},
    },
    // 相关的列表
    listTypeInfo: {
      type: Object,
      default: () => {},
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '180px',
    },
    refObj: {
      type: Object,
      default: () => {},
    },
    size: {
      type: String,
      default: 'medium',
    },
  },
  watch: {
    data: {
      handler: function () {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form);
      },
      deep: true, // 深度监听
    },
  },
  mounted() {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form);
  },
  methods: {
    // 获取字段列表
    getConfigList() {
      return this.fieldList.filter(
        (item) =>
          !Object.prototype.hasOwnProperty.call(item, 'show') ||
          (Object.prototype.hasOwnProperty.call(item, 'show') && item.show)
      );
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      if (row.placeholder) return row.placeholder;
      let placeholder;
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label;
      } else if (row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label;
      } else if (row.type === 'select') {
        placeholder = row.placeholder || '全部';
      } else {
        placeholder = row.label;
      }
      return placeholder;
    },
    // 绑定的相关事件
    handleEvent(evnet, type, data) {
      this.$emit('handleEvent', evnet);
      emitHandleChange(type, data);
    },
    // 派发按钮点击事件
    handleClick(event) {
      event && event();
    },
  },
};
</script>

<style lang="scss" scoped>
// 自定义form相关
.page-form {
  .el-form-item {
    display: inline-block;
    // float: left;
    // width: 33%;
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-textarea {
        width: 200px;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }
  .el-form-block {
    display: block;
    width: 100%;
    .el-form-item__content {
      .el-textarea {
        width: 100%;
      }
    }
  }
}
.page-form-block {
  .el-form-item {
    display: block;
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-textarea {
        width: inherit;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }
  .el-form-block {
    display: block;
    width: 100%;
    .el-form-item__content {
      .el-textarea {
        width: 100%;
      }
    }
  }
}
</style>
