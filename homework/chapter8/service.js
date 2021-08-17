// 加载框架并新建实例
const fastify = require('fastify')({
  logger: true
})

const path = require('path')
const fastifyStatic = require('fastify-static')

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
})

const io = require('socket.io')(fastify.server);

// 声明路由
fastify.get('/', function (connection , reply) {
  return reply.sendFile('index.html')
})

fastify.get('/socket', { websocket: true }, function (connection , req) {
  connection.socket.on('message', message => {
    // message.toString() === 'hi from client'
    connection.socket.send('hi from server')
  })
})

// 启动服务！
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})



// 多线程 worker
const childProcess = require('child_process');
const cpuNum = require('os').cpus().length;

let workers = [];
let cur = 0;

for (let i = 0; i < cpuNum; ++i) {
  let current = childProcess.fork('./src/worker.js');
  workers.push(current);
  current.on('message', (msg) => {
    console.log('Received message from worker:' + msg);
    io.emit('message', msg);
  });
}

io.on('connection', function (socket) {
  console.log('服务端socket开启成功');
  socket.on('message', function (data) {
    workers[cur].send({ index:cur, msg: data });
    cur = Number.parseInt((cur + 1) % cpuNum);
  });
  socket.on('disconnect', function () {
    console.log('关闭链接');
  });
});