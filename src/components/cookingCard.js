async function getRecipes(lastDate) {
    return (await axios.get(TIMS_API_URL + "/api/cooking", { params: {"lastDate" : lastDate} })).data
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
        <transition name="fade">
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
    </transition>
    `
    });

    recipes = await getRecipes(undefined);

    cooking = new Vue({
        el: '#cooking',
        data: {recipes},
    });

    document.getElementById("cookingMore").addEventListener("click", loadMore);
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

async function loadMore() {
    lastestRecipeDate = cooking._data.recipes.slice(-1)[0].Date
    recipeDateToGrab = new Date(lastestRecipeDate);
    recipeDateToGrab.setDate(recipeDateToGrab.getDate() - 1);

    moreRecipes = (await getRecipes(recipeDateToGrab))
    moreRecipes.forEach(function(recipe) {
        cooking._data.recipes.push(recipe);
    })
}