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

console.log("here")

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});

console.log("here again")

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

console.log(process.env.PORT)

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

backgroundPaths = [
  { "image": "/images/TimsOKC/WarpDrive.gif" },
  { "image" : "/images/TimsOKC/underground_green.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/underground_blue.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/lines1.jpg"},
  { "image" : "/images/TimsOKC/bricks2.jpg"},
  { "image" : "/images/TimsOKC/wood-paneling.jpg"},
  { "image" : "/images/TimsOKC/Matrix.gif"},
  { "image" : "/images/TimsOKC/beetleborgs.gif"},
  { "image" : "/images/TimsOKC/airplane.jpg"},
  { "image" : "/images/TimsOKC/bigClouds.jpg"},
  { "image" : "/images/TimsOKC/ChinaChef.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/dirt.jpg"},
  { "image" : "/images/TimsOKC/fire.jpg"},
  { "image" : "/images/TimsOKC/goldenDome.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/guestroom.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/hefner1.jpg"},
  { "image" : "/images/TimsOKC/neighborhood1.jpg"},
  { "image" : "/images/TimsOKC/park.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/rando.jpg"},
  { "image" : "/images/TimsOKC/Rick.jpg"},
  { "image" : "/images/TimsOKC/russ-sufjan.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/sk.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/sky1.jpg"},
  { "image" : "/images/TimsOKC/thunder.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/ThaiKitchen.jpg"},
  { "image" : "/images/TimsOKC/trash.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/unnamed.jpg"},
  { "image" : "/images/TimsOKC/yellow.jpg"},
  { "image" : "/images/TimsOKC/zelda.gif"},
  { "image" : "/images/TimsOKC/building1.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/cheese-grater.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/bread.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/downtown2.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/bridge.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/door.jpg", "opacity" : .4},
  { "image" : "/images/TimsOKC/HefnerSunset.jpg"},
  { "image" : "/images/TimsOKC/OKRiver.jpg"},
  { "image" : "/images/TimsOKC/OKRiver2.jpg"},
  { "image" : "/images/TimsOKC/vr.jpg", "opacity" : .4},
]
catchPhrases = [
  "A Good Place",
  "Mostly Harmless",
  "Digimon are the Champions",
  "A website for me",
  "A work in progress",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","",
  "Share and enjoy",
  "😎",
  "Cool. Cool. Cool Cool Cool.",
  "Six Seasons and a movie",
  "Extremely Online",
  "All things serve the beam",
  "Ad Astra per aspera",
  "Labor omnia vincit",
  "#WhyNot",
  "⚡ Thunder Up ⚡",
  "Only good content",
  "No crying till the end",
  "Time, Truth, Heart"
]

const base = Airtable.base('app3Q7m6yl9TLjbbP');
const goodreadsUserId = 12784983;

const otgw = pug.compileFile('./content/static/PUG/homeOtgw.pug');
const compiledFunction = pug.compileFile('./content/static/PUG/home.pug');
const youtube = pug.compileFile('./content/static/PUG/yt.pug');
const liminality = pug.compileFile('./content/static/PUG/liminalityPage.pug')

app.get('/yt', asyncMiddleware(async function (req, res) {
  
  console.log("yt")
  
  res.send(youtube({
    backgroundImage: "/images/TimsOKC/otgw.jpg",
    url: "/images/TimsOKC/otgw.gif"
  }));
}))

app.get("/liminality", asyncMiddleware(async function (req, res) {
  console.log("liminality")
  
  res.send(liminality());
}))

app.get('/otgw', asyncMiddleware(async function (req, res) {
  res.send(otgw({
    backgroundImage: "/images/TimsOKC/otgw.jpg",
    url: "/images/TimsOKC/otgw.gif"
  }));
}))

  app.get('/api/cooking', asyncMiddleware(async function (req, res) {
    lastDate = req.query['lastDate'] || "";

    recipeNightsRecords = await airtableFuncs.getLatestRecipe2(base, lastDate);
  
    recipesPromises = recipeNightsRecords.map(async function (recipeNight) {
      recipeRecord = await airtableFuncs.getRecipeRecord(base, recipeNight.fields.Recipe[0])
      pic = ""
      if (!recipeRecord.fields["Attachments"]) {
        pic = "http://orcz.com/images/7/71/BreathoftheWildDubiousFood.jpg"
      }
      else {
        pic = recipeRecord.fields["Attachments"][0].url
      }
      return {
          "Pic" : pic,
          "Name" : recipeRecord.fields["Recipe Name"],
          "Date" : recipeNight.fields["Date"],
          "Url" : recipeRecord.fields["URL"],
          "Success" : (recipeNight.fields.Success || "🤷") + "!",
      }
    });
  
    recipes = await Promise.all(recipesPromises);
  
    res.send(recipes);
    }));

  app.get('/api/currentlyReading', asyncMiddleware(async function (req, res) {
    currentlyReading = await
      goodreadsFuncs.getShelf("currently-reading", goodreadsUserId, myCredentials)
  
    currentlyReadingFormatted = goodreadsFuncs.formatCurrentlyReading(currentlyReading);
  
    res.send(currentlyReadingFormatted);
    }));

  app.get('/api/recentReviews', asyncMiddleware(async function (req, res) {
    page = req.query['page'] || 0;
    
    recentReviews = await
      goodreadsFuncs.getShelf("read", goodreadsUserId, myCredentials, page);
  
    recentReviewsFormatted = goodreadsFuncs.formatReview(recentReviews);

    res.send(recentReviewsFormatted);
    }));

app.get('*', asyncMiddleware(async function (req, res) {

  console.log("home")

  pic = backgroundPaths[getRandomInt(backgroundPaths.length)],

  res.send(compiledFunction({
    message: "A placeholder for something I might do someday maybe.",
    backgroundImage: pic.image,
    catchphrase: catchPhrases[getRandomInt(catchPhrases.length)],
    backgroundOpacity: pic.opacity || 0,
    goodreadsCss: getRandomInt(3) + 1
  }))
  })
)

app.listen((process.env.PORT || 8000));
