function getLatestRecipe(base)
{
    return base('Recipe Nights').select({
      maxRecords: 3,
      sort: [{field: "Date", direction: "desc"}]
    }).firstPage();
}

async function getLatestRecipe2(base, lastRecipeDate)
{
    pageSize = 3;
    filterByFormula = ""
    if (lastRecipeDate) {
        filterByFormula = "IF(DATETIME_DIFF('" + lastRecipeDate + "', {Date}, 'units') < 0, 0, 1)"
    }

    return base('Recipe Nights').select({
        pageSize: pageSize,
        sort: [{field: "Date", direction: "desc"}],
        filterByFormula: filterByFormula
      }).firstPage();
}

function getRecipeRecord(base, recordId)
{
    return base('Recipes').find(recordId);
}

module.exports = {
    getLatestRecipe,
    getRecipeRecord,
    getLatestRecipe2
}
