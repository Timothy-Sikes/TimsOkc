function getLatestRecipe(base)
{
    return base('Recipe Nights').select({
      maxRecords: 1,
      sort: [{field: "Date", direction: "desc"}]
    }).firstPage();
}

function getRecipeRecord(base, recordId)
{
    return base('Recipes').find(recordId);
}

module.exports = {
    getLatestRecipe,
    getRecipeRecord
}
