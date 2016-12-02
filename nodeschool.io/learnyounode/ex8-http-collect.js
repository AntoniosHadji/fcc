// var http = require('http')
// var bl = require('bl')
//
// http.get(process.argv[2], function (response) {
//   response.pipe(bl(function (err, data) {
//     if (err) {
//       return console.error(err)
//     }
//     data = data.toString()
//     console.log(data.length)
//     console.log(data)
//   }))
// })
const http = require('http');

// process.argv[2] will be the command line arguments (url)
// https://nodejs.org/dist/latest-v7.x/docs/api/http.html#http_http_get_options_callback

http.get(process.argv[2], cbResponseHandler)
    .on('error', cbErrorHandler);

/** handle Response
 * @param {Object} res response object
 */
function cbResponseHandler(res) {
  const statusCode = res.statusCode;

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  }
  if (error) {
    console.log(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  // set response to text
  res.setEncoding('utf8');
  let rawData = '';
  // concatenate data chunks
  res.on('data', (chunk) => rawData += chunk);
  // display information on full response
  res.on('end', () => {
    try {
      console.log(rawData.length);
      console.log(rawData);
    } catch (e) {
      console.log(e.message);
    }
  });
}

/** handle errors
 * @param {Object} e error object
 * **/
function cbErrorHandler(e) {
  console.log(`Got error: ${e.message}`);
}
// vim: set foldlevel=99 :
