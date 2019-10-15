const axios = require('axios')
const xml2js = require('xml2js');

var parser = new xml2js.Parser();
const goodreadsApiBase = "https://www.goodreads.com"

async function getUserShelves(userId, credentials)
{
    response = await axios.get(goodreadsApiBase + "/shelf/list.xml?key=" + credentials.key + "&user_id=" + userId);
    return parser.parseStringPromise(response.data);
}

async function getShelf(shelfName, userId, credentials)
{
    response = await axios.get(goodreadsApiBase + "/review/list?v=2&"
        + "key=" + credentials.key
        + "&id=" + userId
        + "&shelf=" + shelfName
        + "&sort=date_started"
        + "&per_page=5");

    return parser.parseStringPromise(response.data);
}

/*
    Takes in a shelf and returns the data needed for displaying them in an array
*/
function formatCurrentlyReading(shelf)
{   
    return shelf.GoodreadsResponse.reviews[0].review.map(function (review) {
        return {
            "title": review.book[0].title[0],
            "link": review.book[0].link,
            "image": review.book[0].image_url
        }
    })
}

function formatReview(shelf)
{
    return shelf.GoodreadsResponse.reviews[0].review.map(function (review) {
        return {
            "title": review.book[0].title[0],
            "link": review.link,
            "image": review.book[0].image_url,
            "stars": review.rating,
            "review": review.body[0]
        }
    })
}

module.exports = {
    getUserShelves,
    getShelf,
    formatCurrentlyReading,
    formatReview
}
