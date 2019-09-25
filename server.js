var express = require('express');
var app = express();
const pug = require('pug');

app.use(express.static('./content/static/'));


app.get('*', function (req, res) {
  const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');

  res.send(compiledFunction({
    message: "A placeholder for something I might do someday maybe.",
    name: "test",
    url: "/images/TimsOKC/carbonara.jpg",
    foodName: "Spaghetti Carbonara",
    foodDate: "9/24/19",
    foodUrl: "https://cooking.nytimes.com/recipes/12965-spaghetti-carbonara"
  }))

})

app.listen((process.env.PORT || 8000));
