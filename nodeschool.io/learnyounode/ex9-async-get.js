const http = require('http')

// process.argv[2-4] will be three command line arguments (urls)
// https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_get_options_callback


http.get('http://www.google.com/index.html', (res) => {
  console.log(`Got response: ${res.statusCode}`);
  // consume response body
  res.resume();
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});



