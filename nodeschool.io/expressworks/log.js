
const morgan = require('morgan');
const fs = require('fs');
const logStream = fs.createWriteStream(__dirname + '/node.log', {flags: 'a'});
app.use(morgan('combined', {stream: logStream}));
