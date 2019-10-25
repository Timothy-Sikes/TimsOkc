async function getRecipes() {
    return (await axios.get(TIMS_API_URL + "/api/cooking")).data
}

async function start()
{
    Vue.component('cookingcard', {
        data: function () {
            return {recipe: null, cookingCardLoaded: false};
        },
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

    recipes = await getRecipes();

    cooking = new Vue({
        el: '#cooking',
        data: {recipes},
    });
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