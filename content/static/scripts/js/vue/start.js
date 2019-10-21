async function start()
{
    Vue.component('cookingcard', {
        data: function () {
            return {recipe: null, cookingCardLoaded: false};
        /*return {
            "Url": "https://thecookingjar.com/eggs-hell-shakshuka/",
            "Name": "Shaksuka (Eggs in Hell)",
            "Date": "2019-10-12",
            "Pic": "https://dl.airtable.com/.attachments/2223a43ceb35b6c1b4f9c34d7cd7e59d/deb417f7/Image13May20190530PM.jpg",
            "Success": "Excellent"
        }*/
        },
        /*mounted() {
            axios.get("http://localhost:8000/api/cooking")
                .then(response => {
                    console.log(response.data[0]);
                    console.log(response.data[0].Pic);
                    this.recipe = response.data[0]
                    this.recipes = response.data
                    this.cookingCardLoaded = true;
                });
        },*/
        props: {
            recipe: Object
        },
        template: `
        <div class="cooking-card">
        <div class="container standout cooking-card2">
            <a v-bind:href="recipe.Url" target="_blank">
                <div class="top-10"></div>
                <div class="cooking-title header1">
                    <h3 style="text-align: center;"> {{recipe.Name}} </h3>
                </div>
                <div class="top-10"></div>
                <div class="picture-holder">
                    <img v-bind:src="recipe.Pic" style='width: 200px;'></img>
                </div>
                <div class="top-10"></div>
                <div class="picture-holder">
                    <p> {{recipe.Date}} </p>
                    <p>This recipe was {{recipe.Success}}</p> 
                </div>
                <div class="top-10"></div>
            </a>
        </div>
    </div>
    </div>
    `
    });

    Vue.component('currentlyreading', {
        data: function () {
            return {book: null};
        },
        props: {
            book: Object
        },
        template: `
        <div id="currently-reading-card">
            <div class="container standout3">
                <a v-bind:href="book.link" target="_blank")
                    <div class="top-10"></div>
                    <div class="book-title header3">
                        <h3 style="text-align: center;"> {{book.title}}
                    </div>
                    <div class="top-10"></div>
                    <div class="picture-holder">
                        <img v-bind:src="book.image" style='width:100px;'></img>
                    <div class="top-10"></div>
    `
    });

    Vue.component('recentreviews', {
        data: function () {
            return {book: null};
        },
        props: {
            book: Object
        },
        template: `
        <div class="recent-review-card">
            <div class="container standout3">
                <a v-bind:href="book.link" target="_blank">
                    <div class="top-10"></div>
                    <div class="book-title header3">
                        <h3 style="text-align: center;"> {{book.title}} </h3>
                    </div>
                <p class="star">
                    {{book.star}}
                </p>
                <div class="top-10"></div>
                <div class="picture-holder">
                    <img v-bind:src="book.image" style='width:100px;'></img>
                </a>
            <div class="top-10"></div>
            <div class="book-review">
                <p v-html="book.review"></p>
            </div>
    `
    });

  recipes = await getRecipes();

  cooking = new Vue({
    el: '#cooking',
    data: {recipes}
  })

  currentlyReading = await getCurrentlyReading();
  recentReviews = await getRecentReviews();
  console.log(recentReviews);

  currentlyReadingApp = new Vue({
      el: '#book-currently-reading',
      data: {currentlyReading}
  })

  recentReviewsApp = new Vue({
    el: '#book-recent-reviews',
    data: {recentReviews}
})
}

async function getRecipes() {
    return (await axios.get("http://localhost:8000/api/cooking")).data
  }

async function getCurrentlyReading() {
    return (await axios.get("http://localhost:8000/api/currentlyReading")).data
  }

async function getRecentReviews() {
    return (await axios.get("http://localhost:8000/api/recentReviews")).data
  }