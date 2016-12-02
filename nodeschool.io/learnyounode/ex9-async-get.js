const http = require('http');

// process.argv[2-4] will be three command line arguments (urls)
// https://nodejs.org/dist/latest-v7.x/docs/api/http.html#http_http_get_options_callback

for (let i = 2; i < process.argv.length; i++) {
  http.get(process.argv[i], cbResponseHandler)
    .on('error', cbErrorHandler);
}

/** handle Response
 * @param {Object} res response object
 */
function cbResponseHandler(res) {
  const statusCode = res.statusCode;
  // const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  }// else if (!/^application\/json/.test(contentType)) {
   // error = new Error(`Invalid content-type.\n` +
   //                 `Expected application/json but received ${contentType}`);
  // }
  if (error) {
    console.log(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);
  res.on('end', () => {
    try {
      console.log(rawData);
      // let parsedData = JSON.parse(rawData);
      // console.log(parsedData[0]);
      // console.log(`${Object.keys(parsedData).length} total keys`);
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
