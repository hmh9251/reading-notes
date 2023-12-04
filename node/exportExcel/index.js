var xl = require('excel4node');
const data = require('./index');

function rgbToHex(rgb) { 
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

function rgb(r,g,b) {   
  let red = rgbToHex(r);
  let green = rgbToHex(g);
  let blue = rgbToHex(b);
  return red + green + blue;
};
// 创建一个工作簿
var wb = new xl.Workbook();

// 创建工作表
var ws = wb.addWorksheet('Sheet 1');

// 设置列宽
ws.column(3).setWidth(20);

// 创建一些数据
var arr = data.arr;

// 写入数据和样式
ws.cell(1, 1).string('潘通色号');
ws.cell(1, 2).string('rbg');
ws.cell(1, 3).string('色块')
for (var i = 0; i < arr.length; i++) {
  ws.cell(i+2, 1).string(arr[i].name);
  ws.cell(i+2, 2).string(arr[i].color);
  ws.cell(i+2, 3).style(wb.createStyle({
    fill: {
      type: 'pattern', 
      patternType: 'solid', 
      fgColor: eval(arr[i].color), // 我们将背景颜色设置为黄色
    },
  }));
}

// 写入到文件
wb.write('ExcelWithColors.xlsx');


