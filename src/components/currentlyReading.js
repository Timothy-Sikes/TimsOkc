async function getCurrentlyReading() {
    return (await axios.get("http://localhost:8000/api/currentlyReading")).data
  }

async function start()
{
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

    currentlyReading = await getCurrentlyReading();

    currentlyReadingApp = new Vue({
        el: '#book-currently-reading',
        data: {currentlyReading}
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