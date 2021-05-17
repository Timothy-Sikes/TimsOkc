async function start()
{
    document.getElementById("liminalityMore").addEventListener("click", loadLiminality);
}

async function loadLiminality() {
    console.log("load liminality.")
    var element = document.getElementById("background2");
    element.classList.add("grow");

    var element2 = document.getElementById("background-inner2");
    element2.classList.add("grow");

    var content = document.getElementById("content");
    content.classList.remove("hiddenMine");

    history.pushState({}, "liminality", '/liminality');
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