/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-09-08 11:08:49
 * @LastEditors: kexi
 * @LastEditTime: 2021-09-08 11:17:43
 */
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Comment {
    id: Int
    avatar: String
    name: String
    isTop: Boolean
    content: String
  }

  type Query {
    comment: [Comment]
  }
`);

schema.getQueryType().getFields().comment.resolve = () => {
  return [{
    id: 1,
    avatar: "http://132e1e12e",
    name: "aaaa",
    isTop: true,
    content: "faefqefqwefweqgqwegwqe"
  }]
}

module.exports = schema;