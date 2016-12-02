// var http = require('http')
//
// http.get(process.argv[2], function (response) {
//  response.setEncoding('utf8')
//  response.on('data', console.log)
//  response.on('error', console.error)
// }).on('error', console.error)

const http = require('http');

// process.argv[2] will be a url
// https://nodejs.org/dist/latest-v7.x/docs/api/http.html#http_http_get_options_callback

http.get(process.argv[2], cbResponseHandler)
  .on('error', cbErrorHandler);

/** handle Response
 * @param {Object} response response object
 */
function cbResponseHandler(response) {
  const statusCode = response.statusCode;

  // handle error condition first
  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    response.resume();
    return;
  }

  // then process response
  response.setEncoding('utf8');
  response.on('data', (chunk) => console.log(chunk));
}

/** handle errors
 * @param {Object} e error object
 * **/
function cbErrorHandler(e) {
  console.error(`Got error: ${e.message}`);
}
// vim: set foldlevel=99 :
