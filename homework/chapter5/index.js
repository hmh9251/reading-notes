/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-07-28 15:07:54
 * @LastEditors: kexi
 * @LastEditTime: 2021-07-28 17:52:45
 */
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const fs = require('fs');
const path = require('path');
const app = new Koa();
const router = new Router();

const webpackConfig = require('./webpack.config');
const webpack = require('webpack')

const staticFiles = require('koa-static');

router.get('/', (ctx, next) => {
  ctx.type = "html";
  ctx.body = fs.readFileSync("index.html");
})

router.post('/compiler', async (ctx, next) => {
  let { content } = ctx.request.body;
  let confirm = "error", info = "";
  if (content){
    // 创建vue组件
    let isFile = await createVueComponentsFile(content);
    if (isFile) {
      try {
        let isCompiler = await compilerVue();
        if (isCompiler) confirm = "success";
      } catch(error) {
        confirm = "error"
        info = error;
      } finally {
        ctx.response.body = JSON.stringify({ data: confirm, info });
      }
    }
  }
  ctx.response.body = JSON.stringify({ data: confirm, info });
});

/**
 *  设置 public文件夹为静态资源文件夹
 * */
app.use(staticFiles(path.join(__dirname, 'public')))
  .use(bodyParser())
  .use(router.routes()) //作用：启动路由
  .use(router.allowedMethods())
  .listen(3000);





// 一些utils方法
/**
 * 生成vue文件
 * @param {string} content 
 * @returns 
 */
function createVueComponentsFile(content) {
  return new Promise((resolve, reject) => {
    fs.writeFile('./custom.vue', content, {}, err => {
      if (err) {
        reject(err);
        throw err;
      }
      // readBundleJs();
      resolve(true)
    })
  })
}

/**
 * 编译生成的vue单文件
 * @returns 
 */
function compilerVue() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(stats.compilation.errors);
        console.log('webpack err:', err);
        console.log('stats:', stats.compilation.errors);
        // throw err;
      }
      resolve(true);
    })
  })
}

function readBundleJs() {
  return new Promise((resolve, reject) => {
    fs.readFile('./custom.vue', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        throw err;
      }
      // console.log('读取文件内容：');
      // console.log(data)
      resolve(true);
      removeFile();
  });
  })
}

function removeFile() {
  fs.unlink('./custom.vue',function(error){
      if(error){
          return false;
      }
      console.log('删除文件成功');
  })
}