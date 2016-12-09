const express = require('express');
const app = express();

// app.param('id', (req, res, next, messageId) => {
//   req.computedHash = require('crypto')
//                       .createHash('sha1')
//                       .update(new Date().toDateString() + messageId)
//                       .digest('hex');
//   next();
// });
//
// app.get('message/:id', (req, res, next) => {
//   res.send(req.computedHash);
// });


app.put('/message/:id', (req, res) => {
  let id = req.params.id;
  let str = require('crypto')
              .createHash('sha1')
              .update(new Date().toDateString() + id)
              .digest('hex');
  res.send(str);
});

app.listen(process.argv[2]);
