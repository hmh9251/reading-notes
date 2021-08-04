/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 13:56:35
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-02 13:56:35
 */
const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  devServer: {
    port: 9999,
    open: true,
    disableHostCheck: true,
  },
};
