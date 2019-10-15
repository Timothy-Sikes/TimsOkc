var express = require('express');
var app = express();
const pug = require('pug');
var goodreadsFuncs = require("./goodreads/goodreads.js")
var Airtable = require('airtable');
var airtableFuncs = require('./airtable/airtableFuncs.js')

app.use(express.static('./content/static/'));

const myCredentials = {
  key: process.env.GOODREADS_KEY,
  secret: process.env.GOODREADS_SECRET
};

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

catchPhrases = [
  "A Good Place",
  "Mostly Harmless",
  "Digimon are the Champions",
  "A website for me",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","",
  "Share and enjoy",
  "😎",
  "Ka is a wheel",
  "Cool. Cool. Cool Cool Cool.",
  "Six Seasons and a movie",
  "Save the cheerleader save the world",
  "19",
  "Extremely Online",
  "All things serve the beam",
  "Leave luck to the gods",
  "Ad Astra per aspera",
  "Labor omnia vincit",
  "#WhyNot",
  "⚡ Thunder Up ⚡",
  "Time is an illusion. Lunchtime doubly so.",
  "If you build it they will come",
  "No crying till the end",
  "Time, Truth, Heart"
]

const base = Airtable.base('app3Q7m6yl9TLjbbP');
const goodreadsUserId = 12784983;

app.get('*', asyncMiddleware(async function (req, res) {
  recipeNightsRecords = await airtableFuncs.getLatestRecipe(base);
  const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');

  recipesPromises = recipeNightsRecords.slice(0,3).map(async function (recipeNight) {
    recipeRecord = await airtableFuncs.getRecipeRecord(base, recipeNight.fields.Recipe[0])
    return {
      "recipe" :
      {
        "Pic" : recipeRecord.fields["Attachments"][0].url || "http://orcz.com/images/7/71/BreathoftheWildDubiousFood.jpg",
        "Name" : recipeRecord.fields["Recipe Name"],
        "Date" : recipeNight.fields["Date"],
        "Url" : recipeRecord.fields["URL"],
        "Success" : (recipeNight.fields.Success || "🤷") + "!",
      }
    }
  });


  recipes = await Promise.all(recipesPromises)
  let [currentlyReading, recentReviews, ] = await Promise.all([
    goodreadsFuncs.getShelf("currently-reading", goodreadsUserId, myCredentials),
    goodreadsFuncs.getShelf("read", goodreadsUserId, myCredentials)]);

  currentlyReadingFormatted = goodreadsFuncs.formatCurrentlyReading(currentlyReading);
  recentReviewsFormatted = goodreadsFuncs.formatReview(recentReviews);

  res.send(compiledFunction({
    message: "A placeholder for something I might do someday maybe.",
    backgroundImage: backgroundPaths[getRandomInt(backgroundPaths.length)],
    catchphrase: catchPhrases[getRandomInt(catchPhrases.length)],
    cookingCards: recipes,
    currentlyReading: currentlyReadingFormatted,
    recentReviews: recentReviewsFormatted
  }))
  })
)

app.listen((process.env.PORT || 8000));
