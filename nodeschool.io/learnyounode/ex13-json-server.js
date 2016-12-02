const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    return res.end('Only GET requests accepted\n');
  }

  let reqObj = url.parse(req.url, true);
  let d = new Date(reqObj.query['iso']);
  res.writeHead(200, {'content-type': 'application/json'});

  if (/^\/api\/parsetime/.test(reqObj.pathname)) {
    res.end(JSON.stringify(
      {hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
      }));
  }

  if (/^\/api\/unixtime/.test(reqObj.pathname)) {
    res.end(JSON.stringify(
      {unixtime: d.getTime()}
    ));
  }
});
// first argument is port number
server.listen(Number(process.argv[2]));

