/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-09-01 14:23:26
 * @LastEditors: kexi
 * @LastEditTime: 2021-09-08 11:10:45
 */

const app = new (require('koa'));
const mount = require('koa-mount');
// const static = require('koa-static');
const graphqlHTTP = require('koa-graphql');

app.use(
  graphqlHTTP({
    schema: require('./schema.js')
  })
)

app.listen(3000);
