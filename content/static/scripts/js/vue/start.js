function start()
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
        mounted() {
            axios.get("http://localhost:8000/api/cooking")
                .then(response => {
                    console.log(response.data[0]);
                    console.log(response.data[0].Pic);
                    this.recipe = response.data[0]
                    this.cookingCardLoaded = true;
                });
        },
        template: `
        <div class="cooking-card">
        <div class="container standout cooking-card2">
            <a href="{{recipe.Url}}" target="_blank">
                <div class="top-10"></div>
                <div class="cooking-title header 1">
                    <h3 style="text-align: center;"> {{recipe.Name}} </h3>
                </div>
                <div class="top-10"></div>
                <div class="picture-holder">
                    <img src="{{recipe.Pic}}" style=''></img>
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
    `
    });

  new Vue({
    el: '#cooking2'
  })
}
