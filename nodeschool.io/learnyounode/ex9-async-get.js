const http = require('http');
const bl = require('bl');
let rawData = [];
let counter = 0;

// process.argv[2-4] will be three command line arguments (urls)
// https://nodejs.org/dist/latest-v7.x/docs/api/http.html#http_http_get_options_callback

// loop through all arguments
for (let i = 2; i < process.argv.length; i++) {
  // cal http get
  http.get(process.argv[i], function(response) {
    //pipe response to bl (buffer list)
    response.pipe(bl(function(err, data) {
      // process error condition
      if (err) {
        return console.error(err);
      }
      // add data to array
      rawData[i] = data.toString();
      // keep count
      counter++;
      // when all have been received print out
      if (counter === process.argv.length-2) {
        for (let i = 2; i < process.argv.length; i++) {
          console.log(rawData[i]);
        }
      }
    }));
  });
}

// vim: set foldlevel=99 :
