const express = require('express');
const app = express();

app.set('view engine', 'jade');
// code worked without this line??
app.set('views', process.argv[3]);
app.get('/home', (req, res) => {
  res.render('index', {date: new Date().toDateString()});
});

app.listen(process.argv[2]);
