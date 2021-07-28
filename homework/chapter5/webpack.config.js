/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-07-28 15:54:05
 * @LastEditors: kexi
 * @LastEditTime: 2021-07-28 17:35:27
 */
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: './custom.vue',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public',
    library: 'custom'
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.vue', '.json', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin()
  ]
}