let canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d');

context.font = '30px Arial';
context.fillStyle = 'red'; //填充色
context.strokeStyle = 'blue'; //线框色
context.fillText('Hello Canvas', 10, 50);
context.strokeText('Hello Canvas', 10, 50);