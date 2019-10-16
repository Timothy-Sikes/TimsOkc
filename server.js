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
  "/images/TimsOKC/wood-paneling.jpg",
  "/images/TimsOKC/Matrix.gif",
  "/images/TimsOKC/beetleborgs.gif",
  "/images/TimsOKC/airplane.jpg",
  "/images/TimsOKC/band.jpg",
  "/images/TimsOKC/bigClouds.jpg",
  "/images/TimsOKC/ChinaChef.jpg",
  "/images/TimsOKC/dirt.jpg",
  "/images/TimsOKC/fire.jpg",
  "/images/TimsOKC/goldenDome.jpg",
  "/images/TimsOKC/guestroom.jpg",
  "/images/TimsOKC/hefner1.jpg",
  "/images/TimsOKC/neighborhood1.jpg",
  "/images/TimsOKC/park.jpg",
  "/images/TimsOKC/rando.jpg",
  "/images/TimsOKC/Rick.jpg",
  "/images/TimsOKC/russ-sufjan.jpg",
  "/images/TimsOKC/sk.jpg",
  "/images/TimsOKC/sky1.jpg",
  "/images/TimsOKC/thunder.jpg",
  "/images/TimsOKC/ThaiKitchen.jpg",
  "/images/TimsOKC/trash.jpg",
  "/images/TimsOKC/unnamed.jpg",
  "/images/TimsOKC/yellow.jpg",
  "/images/TimsOKC/zelda.gif",
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

const otgw = pug.compileFile('./content/static/PUG/homeOtgw.pug');
const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');

app.get('/otgw', asyncMiddleware(async function (req, res) {
  res.send(otgw({
    backgroundImage: "/images/TimsOKC/otgw.gif",
    url: "/images/TimsOKC/otgw.gif"
  }));
}))

app.get('*', asyncMiddleware(async function (req, res) {
  recipeNightsRecords = await airtableFuncs.getLatestRecipe(base);

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
    recentReviews: recentReviewsFormatted,
    goodreadsCss: getRandomInt(3) + 1
  }))
  })
)

app.listen((process.env.PORT || 8000));
