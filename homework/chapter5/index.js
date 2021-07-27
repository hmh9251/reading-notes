const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const fs = require('fs');
const path = require('path');
const app = new Koa();
const router = new Router();

const staticFiles = require('koa-static');

router.get('/', (ctx, next) => {
  ctx.type = "html";
  ctx.body = fs.readFileSync("index.html");
})
router.post('/compiler', async (ctx, next) => {
  console.log(ctx.request.body);
  ctx.body = "新闻page"
});

/**
 *  设置 public文件夹为静态资源文件夹
 * */
app.use(staticFiles(path.join(__dirname, 'public')))
  .use(bodyParser())
  .use(router.routes()) //作用：启动路由
  .use(router.allowedMethods())
  .listen(3000);

