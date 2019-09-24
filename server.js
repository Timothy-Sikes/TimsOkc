var express = require('express');
var app = express();

app.use(express.static('./content/static/'));

app.get('*', function (req, res) {
  res.sendfile('./content/static/HTML/main.html');
})

app.listen((process.env.PORT || 8000));
