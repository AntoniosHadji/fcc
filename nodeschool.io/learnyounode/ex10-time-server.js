const net = require('net');
const strftime = require('strftime');

const server = net.createServer((socket) => {
  let d = strftime('%Y-%m-%d %H:%M', new Date());
  socket.write(d);
  socket.end('\n');
});

server.listen(Number(process.argv[2]));
