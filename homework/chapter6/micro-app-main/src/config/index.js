/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 10:47:24
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-02 10:48:46
 */
const config = {
  REACT_MICRO_APP: process.env.VUE_APP_REACT_MICRO_APP,
  VUE_MICRO_APP: process.env.VUE_APP_VUE_MICRO_APP,
  ANGULAR_MICRO_APP: process.env.VUE_APP_ANGULAR_MICRO_APP,
  STATIC_MICRO_APP: process.env.VUE_APP_STATIC_MICRO_APP,
}

// 导出当前环境的配置，默认为 dev 环境
export default config;