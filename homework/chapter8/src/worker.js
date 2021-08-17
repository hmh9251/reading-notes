process.on('message', ({index, msg}) => {
  console.log('Received message from master:' + msg);
  // 子进程向主进程发送消息
  process.send(`这是worker${index}反馈的消息`);
});