const assert = require('chai').assert;
const globals = require('../globals');
const config = require('../wdio.conf.js').config;
const CookingPage = require('../pageobjects/cookingPage');
const LoginPage = require('../pageobjects/loginPage');
const SignUpPage = require('../pageobjects/signupPage');
const RecipePage = require('../pageobjects/recipePage');

describe('Test Suite for cooking site navigation', function () {

    this.retries(globals.MINRETRIES);

    let userName = `test_user${Math.floor(Date.now()/1000).toString()}`;
    let emailAddress =  `${userName}@nytimes.com`;
    let password = 'Password123!';

    it('Verify Creating New User', function () {
        CookingPage.open();
        CookingPage.login();
        assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');

        LoginPage.signUpUser();
        assert.isTrue(SignUpPage.isLoaded(), 'SignUp page is NOT loaded');

        SignUpPage.enterEmailAddress(emailAddress);
        SignUpPage.enterPassword(password);
        SignUpPage.enterConfirmPassword(password);
        SignUpPage.createAccount();

        assert.isTrue(CookingPage.isUserLoggedIn(), `Account ${userName} creation failed - User should have been logged in.`);
        assert.isTrue(CookingPage.isUserHomePageLoaded(), `Account ${userName} creation failed - Users home page should have loaded.`);

    });

    it('Verify Saving Recipe', function () {
        browser.reload();
        CookingPage.open();
        CookingPage.login();
        assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');

        LoginPage.enterUserName(emailAddress);
        LoginPage.enterPassword(password);
        LoginPage.login();
        assert.isTrue(CookingPage.isUserLoggedIn(), 'User is NOT logged in. Please check your credentials.');

        CookingPage.goToRecipeBox();
        let beforeSaveRecipeCount = RecipePage.getRecipeCount();

        CookingPage.clickSiteLogo();
        CookingPage.saveRecipeCard();

        CookingPage.goToRecipeBox();
        assert.isTrue(RecipePage.isLoaded(), 'Recipe page is NOT loaded');

        let afterSaveRecipeCount = RecipePage.getRecipeCount();

        assert.equal(afterSaveRecipeCount, beforeSaveRecipeCount + 1,  'Recipe count does NOT match');
        assert.equal(RecipePage.getSavedRecipeID(), CookingPage.recipeCardID, 'Saved Recipe ID\'s do NOT match');

    });

    it('Verify Un-saving Recipe', function () {
        browser.reload();
        CookingPage.open();
        CookingPage.login();
        assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');

        LoginPage.enterUserName(emailAddress);
        LoginPage.enterPassword(password);
        LoginPage.login();
        assert.isTrue(CookingPage.isUserLoggedIn(), 'User is NOT logged in. Please check your credentials.');

        CookingPage.clickSiteLogo();
        CookingPage.saveRecipeCard();

        CookingPage.goToRecipeBox();
        assert.isTrue(RecipePage.isLoaded(), 'Recipe page is NOT loaded');

        let beforeDeleteRecipeCount = RecipePage.getRecipeCount();
        //console.log(`BEFORE - ${beforeDeleteRecipeCount}`);

        let responseStatus = browser.deleteRecipe(config.baseUrl, LoginPage.userID, CookingPage.recipeCardID);
        assert.equal(responseStatus, 204, 'Delete Recipe API call failed');

        CookingPage.goToRecipeBox();
        assert.isTrue(RecipePage.isLoaded(), 'Recipe page is NOT loaded');
        browser.waitUntil(function () {
            if (RecipePage.getRecipeCount() < beforeDeleteRecipeCount)
                return true;
            else {
                browser.refresh();
            }
        }, globals.WAITFORTIMEOUT, 'Recipe Count not refreshed yet');


        let afterDeleteRecipeCount = RecipePage.getRecipeCount();
        //console.log(`AFTER - ${afterDeleteRecipeCount}`);
        assert.equal(afterDeleteRecipeCount, beforeDeleteRecipeCount - 1, 'Recipe count does NOT match');
    });

});
