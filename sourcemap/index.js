/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-09-24 16:58:17
 * @LastEditors: kexi
 * @LastEditTime: 2021-09-29 17:57:00
 */
/* const rawSourceMap = {
  version: 3,
  file: "min.js",
  names: ["bar", "baz", "n"],
  sources: ["one.js", "two.js"],
  sourceRoot: "http://example.com/www/js/",
  mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA"
}; */
const sourceMap = require('source-map');
const fs = require('fs');

let data = fs.readFileSync('./app.5bf8c3a4.js.map');
let fileContent = data.toString();
let fileObj = JSON.parse(data);
let sources = fileObj.sources;
let sourcesPathMap = {} 
sources.map(item => {
  sourcesPathMap[item.replace(/\.\.\//g,"").replace(/\.\//g, "")] = item;  
})
console.log(sourcesPathMap);
const consumer = new sourceMap.SourceMapConsumer(fileContent);
const lookup = {
  line: 1,
  column: 5621,
}
consumer.then(data => {
  const result = data.originalPositionFor(lookup);
  console.log(result);
  const sourcesRealName = sourcesPathMap[result.source];
  const index = sources.indexOf(sourcesRealName);
  const content = fileObj.sourcesContent[index];
  console.log(content);
})

