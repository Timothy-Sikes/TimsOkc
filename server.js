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

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

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

const base = Airtable.base('app3Q7m6yl9TLjbbP');
const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');

app.get('*', asyncMiddleware(async function (req, res) {
  recipeNightsRecords = await airtableFuncs.getLatestRecipe(base);

  recipesPromises = recipeNightsRecords.slice(0,3).map(async function (element) {
    recipeRecord = await airtableFuncs.getRecipeRecord(base, element.fields.Recipe[0])
    return {
      "recipe" :
      {
        "Pic" : recipeRecord.fields["Attachments"][0].url || "http://orcz.com/images/7/71/BreathoftheWildDubiousFood.jpg",
        "Name" : recipeRecord.fields["Recipe Name"],
        "Date" : recipeNightsRecords[0].fields.Date,
        "Url" : recipeRecord.fields["URL"],
        "Success" : recipeNightsRecords[0].fields.Success + "!" || "🤷",
      }
    }
  });

  recipes = await Promise.all(recipesPromises)

  res.send(compiledFunction({
    message: "A placeholder for something I might do someday maybe.",
    backgroundImage: backgroundPaths[getRandomInt(backgroundPaths.length)],
    cookingCards: recipes
  }))
  })
)

app.listen((process.env.PORT || 8000));
