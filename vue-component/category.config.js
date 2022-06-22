/*
 * @Desc: 资源管理配置文件
 * @Author: luwei
 * @Date: 2020-09-09 14:13:18
 * @LastEditors: luwei
 * @LastEditTime: 2021-03-17 15:37:47
 */

export default {
  data() {
    return {
      // 搜索框参数
      searchParams: {
        fieldList: [
          {
            label: '主类目',
            value: 'categoryName',
            type: 'input'
          }
        ],
        formData: {
          parentId: 0
        }
      },

      // 表格参数
      dataGridOptions: {
        data: [],
        options: {
          isIndexColumns: true,
          hasChildren: true
        },
        columns: [
          {
            prop: 'categoryName',
            label: '主类目'
          },
          {
            prop: 'option',
            label: '操作',
            fixed: 'right',
            slot: true
          }
        ],
        // pagination: {
        //   currentPage: 1,
        //   pageSize: 30,
        //   total: 0
        // }
      }
    };
  }
};
