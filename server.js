var express = require('express');
var app = express();
const pug = require('pug');
var Airtable = require('airtable');
var airtableFuncs = require('./airtable/airtableFuncs.js')

app.use(express.static('./content/static/'));

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

backgroundPaths = [
  "/images/TimsOKC/WarpDrive.gif",
  "/images/TimsOKC/underground_green.jpg",
  "/images/TimsOKC/underground_blue.jpg",
  "/images/TimsOKC/lines1.jpg",
  "/images/TimsOKC/bricks2.jpg",
  "/images/TimsOKC/pdx.jpg",
  "/images/TimsOKC/wood-paneling.jpg",
  "/images/TimsOKC/Matrix.gif",
  "/images/TimsOKC/beetleborgs.gif",
]

const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');
const base = Airtable.base('app3Q7m6yl9TLjbbP');

app.get('*', function (req, res) {
  recipeNightsPromise = airtableFuncs.getLatestRecipe(base)

  recipeNightsPromise().then(function(recipeNightsRecord) {
    recipePromise = airtableFuncs.getRecipeRecord(base, recipeNightsRecord[0].fields.Recipe[0])
  
    recipePromise.then(function(record) {
      res.send(compiledFunction({
        message: "A placeholder for something I might do someday maybe.",
        name: "test",
        recipePic: record.fields["Attachments"][0].url || "http://orcz.com/images/7/71/BreathoftheWildDubiousFood.jpg",
        recipeName: record.fields["Recipe Name"],
        recipeDate: recipeNightsRecord[0].fields.Date,
        recipeUrl: record.fields["URL"],
        recipeSuccess: recipeNightsRecord[0].fields.Success + "!" || "🤷",

        backgroundImage: backgroundPaths[getRandomInt(backgroundPaths.length)]
      }))
    })
  })
})

app.listen((process.env.PORT || 8000));
