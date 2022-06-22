<template>
  <div class="data-grid" v-loading="loading">
    <el-table
      max-height="800"
      v-bind="options"
      :data="data"
      style="width: 100%"
      row-key="id"
      ref="table"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @sort-change="handleSortChange"
      :height="options.height"
      :tree-props="
        options.hasChildren
          ? { children: 'children', hasChildren: 'hasChildren' }
          : {}
      "
    >
      <el-table-column
        v-if="options.mutiSelect"
        type="selection"
        style="width: 50px"
        align="center"
      >
      </el-table-column>

      <el-table-column v-if="options.isIndexColumns" type="index" width="50">
      </el-table-column>

      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :width="column.width"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :sort-by="column.sortBy"
        >
          <template slot-scope="scope">
            <template v-if="!column.slot">
              {{ scope.row[column.prop] ? scope.row[column.prop] : '-' }}
            </template>

            <!-- render -->
            <template v-else slot-scope="scope">
              <slot
                :name="column.prop"
                v-bind:row="scope.row"
                v-bind:index="scope.$index"
              ></slot>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <div class="data-grid-page" v-if="pagination">
      <span style="color: gray"
        >共<span style="color: red">{{ pagination.total }}</span
        >条记录，每页显示{{ pagination.pageSize }}条记录</span
      >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-bind="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dataGrid',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => {
        return {
          mutiSelect: false,
          isIndexColumns: false,
          hasChildren: false,
        };
      },
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    pagination: {
      type: [Object, Boolean],
      default: false,
    },
    selection: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.$emit('getRef', this.$refs.table);
  },
  methods: {
    // 改变每页页数
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.$emit('sizeChange');
    },
    // 翻页
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.$emit('currentChange');
    },
    // 选择
    handleSelectionChange(val) {
      this.$emit('selection', val);
    },
    handleSelect(selection, row) {
      this.$emit('select', selection, row);
    },
    handleSortChange(column, prop, order) {
      this.$emit('handleSortChange', column, prop, order);
    },
  },
};
</script>
<style scoped lang="scss">
.data-grid {
  position: relative;
  padding-bottom: 30px;
  .data-grid-page {
    margin-top: 10px;
    // position: absolute;
    // right: 0;
    text-align: center;
    .el-pagination {
      display: inline-block;
      vertical-align: middle;
    }
  }

  ::v-deep .el-table__row--level-1 {
    background-color: cornsilk;
  }

  ::v-deep .el-table__row--level-2 {
    background-color: #fbce95;
  }
}
</style>
