const axios = require('axios');

module.exports = {
    deleteRecipe: function (baseUrl, userID, recipeID) {
        let nyts = browser.getCookie('NYT-S');
        let deleteRecipeUrl = `${baseUrl}/api/v2/users/${userID}/collectables/recipe/${recipeID}`;

        return axios(deleteRecipeUrl, {
            method: 'delete',
            headers: {
                Cookie: `NYT-S=${nyts.value}`,
                'X-COOKING-API': 'automation'
            },
            params: {includes: 'recipe,external_recipe'},
        }).catch(function(err) {
            console.log(err);
            return err;
        }).then(function (response) {
            return response.status;
        });
    }
};
