<!--
 * @Desc: 
 * @Author: kexi
 * @Date: 2022-01-26 10:45:47
 * @LastEditors: kexi
 * @LastEditTime: 2022-01-26 10:45:48
-->
<template>
  <section>
    <!-- 表格组件 -->
    <template>
      <el-table
        ref="table"
        v-loading="loading"
        size="small"
        fit
        highlight-current-row
        :stripe="stripe"
        :border="border"
        :data="tableData"
        v-bind="$attrs"
        v-on="$listeners"
        @row-click="toggleExpand"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :type="type" width="50" />
        <!-- 展开行 -->
        <slot />
        <!-- 表格字段 -->
        <template v-for="(item,index) in tableColumn">
          <!-- 筛选字段 -->
          <el-table-column
            v-if="item.filters"
            :key="index"
            :width="item.width"
            :align="item.align"
            :label="item.label"
            :prop="item.prop"
            :sortable="item.sortable"
            :filters="item.filters ? item.filters : []"
            :filter-method="filterHandler"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <slot v-if="item.slot" :name="item.prop" v-bind="scope" />
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
            <!-- <template slot-scope="scope">
              <span v-if="item.render">
                {{ item.render(scope.row) }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template> -->
          </el-table-column>
          <!-- 其他字段 -->
          <el-table-column
            v-else
            :key="index"
            :width="item.width"
            :align="item.align"
            :label="item.label"
            :prop="item.prop"
            :sortable="item.sortable"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <slot v-if="item.slot" :name="item.prop" v-bind="scope" />
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
            <!-- <template slot-scope="scope">
              <span v-if="item.render">
                {{ item.render(scope.row) }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template> -->
          </el-table-column>
        </template>
        <!-- 操作字段 -->
        <el-table-column
          v-if="tableOption.label"
          :fixed="tableOption.fixed"
          :width="tableOption.width"
          :label="tableOption.label"
        >
          <template slot-scope="scope">
            <el-button
              v-for="(item,index) in tableOption.options"
              :key="index"
              :type="item.type"
              :icon="item.icon"
              size="mini"
              @click.stop="handleButtonClick(item.methods,scope.row,index)"
            >
              {{ item.label }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 翻页组件 -->
    <template v-if="pagination && paginationObj.total>0">
      <section class="pagination">
        <el-pagination
          :page-sizes="pageSizes"
          :layout="layout"
          :current-page="paginationObj.currentPage"
          :page-size="paginationObj.pageSize"
          :total="paginationObj.total"
          v-bind="$attrs"
          v-on="$listeners"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </section>
    </template>
  </section>
</template>

<script>
export default {
  props: {
    loading: {
      // 加载数据时显示动效
      type: Boolean,
      default: false
    },
    stripe: {
      // 带斑马纹的表格
      type: Boolean,
      default: true
    },
    border: {
      // Table具有竖直方向的边框的
      type: Boolean,
      default: true
    },
    type: {
      /**
       * 对应列的类型
       * 如果设置了 selection 则显示多选框
       * 如果设置了 index 则显示该行的索引（从 1 开始计算）
       * 如果设置了 expand 则显示为一个可展开的按钮
       */
      type: String,
      default: 'index'
    },
    tableData: {
      // 表格数据
      type: Array,
      required: true
    },
    tableColumn: {
      // 表格列
      type: Array,
      required: true
    },
    tableOption: {
      // 表格操作列
      type: Object,
      default: () => {
        return {}
      }
    },
    pagination: {
      // 是否需要翻页组件
      type: Boolean,
      default: true
    },
    layout: {
      // 翻页组件布局，子组件名用逗号分隔
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      // 每页显示个数选择器的选项设置
      type: Array,
      default: () => [10, 30, 50, 100]
    },
    paginationObj: {
      /**
       * total：总条目数
       * currentPage：当前页数，支持 .sync 修饰符
       * pageSize：每页显示条目个数，支持 .sync 修饰符
       */
      type: Object,
      default: () => {
        return {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
      }
    }
  },
  methods: {
    handleButtonClick(methods, row, index) {
      // 按钮事件
      this.$emit('handle-button-click', { methods: methods, row: row, index: index })
    },
    handleSortChange(sort) {
      // 排序参数为 { column, prop, order }
      this.$emit('handle-sort-change', sort)
    },
    handleSelectionChange(val) {
      this.$emit('handle-selection-change', val)
    },
    filterHandler(value, row, column) {
      /**
       * 在列中设置filtersfilter-method属性即可开启该列的筛选，
       * filters 是一个数组，filter-method是一个方法，
       * 它用于决定某些数据是否显示，会传入三个参数：value, row 和 column
       */
      const property = column['property']
      return row[property] === value
    },
    toggleExpand(row) {
      // 用于可展开表格与树形表格，切换某一行的展开状态
      this.$refs.table.toggleRowExpansion(row)
    },
    handleSizeChange(size) {
      this.$emit('handle-size-change', size)
    },
    handleCurrentChange(current) {
      this.$emit('handle-current-change', current)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pagination {
  position: relative;
  text-align: center;
  padding: 5px 0;
}
</style>
