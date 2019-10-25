async function getRecentReviews() {
    return (await axios.get("http://localhost:8000/api/recentReviews")).data
  }

async function start()
{
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

    recentReviews = await getRecentReviews();
    recentReviewsApp = new Vue({
        el: '#book-recent-reviews',
        data: {recentReviews}
    })
}

function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  ready(function() {
    start();
  });