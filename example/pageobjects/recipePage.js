const request = require('request');

class RecipePage extends Page {

    /**
     * page elements
     */
    get savedRecipes() { return browser.element('.nytc---collectionlist---list a[data-id="all"]'); }
    get recipeCount() { return browser.element('.nytc---collectionlist---list a[data-id="all"] .nytc---listitem---count'); }
    get savedRecipeID() { return browser.element('a.nytc---cardbase---cardRecipeInfo') ;}
    get unSaveRecipeButton() { return browser.element('#confirmation-modal .ok-btn') ;}

    /**
     * page methods
    */
    /**
     * Method to validate if Recipe page is loaded
     * @param none
     * @return boolean
    */
    isLoaded() {
        return this.savedRecipes.waitForExist();
    }

    /**
     * Method to get saved recipe count
     * @param none
     * @return int - recipe count
    */
    getRecipeCount() {
        return parseInt(this.recipeCount.getText());
    }

    /**
     * Method to get saved recipe ID
     * @param none
     * @return string - recipe ID
    */
    getSavedRecipeID() {
        let recipeLink = this.savedRecipeID.getAttribute('href');
        let recipeIDRegEx = /\d+/;
        let recipeID = recipeLink.match(recipeIDRegEx);
        console.log(`Saved Recipe link ${recipeLink} and ID ${recipeID}`);
        return recipeID;
    }

    /**
     * Method to unsave a recipe
     * @param none
     * @return none
    */
    unSaveRecipe() {
        if (this.unSaveRecipeButton.waitForExist()) {
            this.unSaveRecipeButton.click();
        }
    }
}

module.exports = new RecipePage();
