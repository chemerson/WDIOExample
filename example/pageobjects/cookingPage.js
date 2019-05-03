class CookingPage extends Page {

    constructor() {
        super();
        this.recipeOfTheDayID = '';
        this.recipeCardID = '';
    }

    /**
     * page elements
     */
    get siteLogo() { return browser.element('a.nytc---sitelogo---logoWrapper div.nytc---sitelogo---logo'); }
    get loginButton() {
        return browser.options.device === 'mobile' ? browser.element('.nytc---drawer---sidebarLogin') : browser.element('div.nytc---loginbtn---loginBtn span.nytc---loginbtn---navSubLabel');
    }
    get hamBurgerButton() {
        return browser.element('a.nytc---hamburgerbtn---hamburger');
    }
    get recipeBox() {return browser.element('div.nytc---loginbtn---loginBtn a.nytc---navbtn---login-child'); }
    get loginUserNameLabel() { return browser.element('.nytc---loginbtn---navSubLabel'); }
    get userSettingsIcon() { return browser.element('.nytc---signupbtn---loggedIn'); }
    get userRegisteredButton() {return browser.element('div.nytc---loginbtn---loginBtn.nytc---loginbtn---registered');}
    get subscribeButton() { return browser.element('.nytc---subscribenavbtn---loggedOut'); }
    get articleSaveRecipeOfTheDay() { return browser.element('article[data-analytics-category="Recipe of the Day"]'); }
    get articleSaveRecipeOfTheDayButton() { return browser.element('article[data-analytics-category="Recipe of the Day"] div.save-group'); }
    get articleSaveRecipeCard() { return browser.element('article.card.recipe-card:not(.saved):first-child'); }
    get articleSaveRecipeCardButton() { return browser.element('article.card.recipe-card:not(.saved):first-child div.control-save-btn'); }
    get newsLetterSignUpEmail() {return browser.element('input[id=sam-newsletter-email]'); }

    /**
     * page methods
    */
    /**
     * Method to go to NYT cooking base URL
     * @param none
     * @return none
    */
    open() {
        super.open('/');
    }

    /**
     * Method to click NYT cooking website logo
     * @param none
     * @return none
    */
    clickSiteLogo() {
        if (this.siteLogo.waitForExist()) {
            this.siteLogo.click();
        }
    }

    /**
     * Method to take user to login page
     * @param none
     * @return none
    */
    login() {
        if(browser.options.device === 'mobile') {
            this.hamBurgerButton.waitForVisible();
            this.hamBurgerButton.click();
            this.loginButton.waitForExist();
            this.loginButton.click();
        } else {
            this.loginButton.waitForExist();
            this.loginButton.click();
        }
    }

    /**
     * Method to go to user recipe inbox
     * @param none
     * @return none
    */
    goToRecipeBox() {
        if (this.recipeBox.waitForExist()) {
            this.recipeBox.click();
        }
    }

    /**
     * Method to get logged in user name
     * @param none
     * @return string - loggedInUser
    */
    getUserName() {
        let loggedInUser = this.loginUserNameLabel.getText();
        console.log(`User is logged in as ${loggedInUser}`);
        return loggedInUser;
    }

    /**
     * Method to validate if user is logged in
     * @param none
     * @return boolean
    */
    isUserLoggedIn() {
        //console.log(`User registered button should be present`);
        return this.userRegisteredButton.isExisting();
    }

    /**
     * Method to validate if user home page is loaded
     * @param none
     * @return boolean
    */
    isUserHomePageLoaded() {
        return this.userSettingsIcon.waitForExist();
    }

    /**
     * Method to get recipe of the day ID
     * @param none
     * @return string
    */
    getRecipeOfTheDayID() {
        let recipeID = this.articleSaveRecipeOfTheDay.getAttribute('data-id');
        //console.log(`Recipe of the Day ID - ${  recipeID}`);
        return recipeID;
    }

    /**
     * Method to get recipe ID saved from the general recipe card
     * @param none
     * @return string
    */
    getRecipeID() {
        let recipeID = this.articleSaveRecipeCard.getAttribute('data-id');
        //console.log(`General Recipe ID - ${  recipeID}`);
        return recipeID;
    }

    /**
     * Method to save recipe of the day
     * @param none
     * @return none
    */
    saveRecipeOfTheDay() {
        if (this.articleSaveRecipeOfTheDayButton.waitForExist()) {
            this.recipeOfTheDayID = this.getRecipeOfTheDayID();
            this.articleSaveRecipeOfTheDayButton.click();
        }
    }

    /**
     * Method to save recipe from the list of recipe cards
     * @param none
     * @return none
    */
    saveRecipeCard() {
        this.articleSaveRecipeCardButton.scroll();
        if (this.articleSaveRecipeCardButton.waitForExist()) {
            this.recipeCardID = this.getRecipeID();
            this.articleSaveRecipeCardButton.click();
        }
    }
}

module.exports = new CookingPage();
