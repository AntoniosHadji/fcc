const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'content-type': 'text/plain'});
  // second argument is text file name
  fs.createReadStream(process.argv[3]).pipe(res);
});
// first argument is port number
server.listen(Number(process.argv[2]));

