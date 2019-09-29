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

const base = Airtable.base('app3Q7m6yl9TLjbbP');
const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');

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
      }))
    })
  })
})

app.listen((process.env.PORT || 8000));
