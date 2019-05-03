const assert = require('chai').assert;
const globals = require('../globals');
const config = require('../wdio.conf.js').config;
const CookingPage = require('../pageobjects/cookingPage');
const LoginPage = require('../pageobjects/loginPage');
const SignUpPage = require('../pageobjects/signupPage');
const RecipePage = require('../pageobjects/recipePage');
const Target = require('wdio-eyes.selenium-service').getTarget();

describe('Test Suite for cooking site navigation', function () {

    //browser.eyesSetBatch('Test Suite for cooking site navigation');

    this.retries(globals.MINRETRIES);

    let userName = `test_user${Math.floor(Date.now()/1000).toString()}`;
    let emailAddress =  `${userName}@nytimes.com`;
    let password = 'Password123!';

    it.only('Verify Creating New User', function () {
        try {
            browser.eyesOpen('Creating New User');
            CookingPage.open();
            scrollPage();  //CME

          //  browser.eyesCheck('Eyes check by element', Target.region(CookingPage.siteLogo));
           
         //   browser.eyesCheck('Eyes check by id', Target.region(By.id("container")).fully());
          //  browser.eyesCheck('Eyes check by className', Target.region(By.className("nytc---loginbtn---loginBtn")).fully());
         //   browser.eyesCheck('Eyes check region', Target.region({
         //       left: 10,
         //       top: 10,
         //       width: 20,
          //      height: 40 }));


            browser.eyesCheckWindow('Main Cooking Page');
            CookingPage.login();
            assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');
            browser.eyesCheckWindow('Cooking Login Page');

            LoginPage.signUpUser();
            assert.isTrue(SignUpPage.isLoaded(), 'SignUp page is NOT loaded');
            browser.eyesCheckWindow('Cooking Sign Up Page');

            SignUpPage.enterEmailAddress(emailAddress);
            SignUpPage.enterPassword(password);
            SignUpPage.enterConfirmPassword(password);
            SignUpPage.createAccount();

            assert.isTrue(CookingPage.isUserLoggedIn(), `Account ${userName} creation failed - User should have been logged in.`);
            assert.isTrue(CookingPage.isUserHomePageLoaded(), `Account ${userName} creation failed - Users home page should have loaded.`);
            browser.eyesClose(false);

        } catch (err) {
            console.log('failure');
            console.log(err);
            browser.eyesClose(true);
        }

    });

    it('Verify Saving Recipe', function () {
        try {
            browser.reload();
            browser.eyesOpen('Verify Saving Recipe');
            CookingPage.open();
            scrollPage();  //CME

            CookingPage.login();
            assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');

            LoginPage.enterUserName(emailAddress);
            LoginPage.enterPassword(password);
            LoginPage.login();
            assert.isTrue(CookingPage.isUserLoggedIn(), 'User is NOT logged in. Please check your credentials.');
            browser.eyesCheckWindow('Cooking User Logged In');

            CookingPage.goToRecipeBox();
            let beforeSaveRecipeCount = RecipePage.getRecipeCount();
            browser.eyesCheckWindow('Cooking Recipe Box');

            CookingPage.clickSiteLogo();
            CookingPage.saveRecipeCard();
            browser.eyesCheckWindow('Cooking Save Recipe Card');

            CookingPage.goToRecipeBox();
            assert.isTrue(RecipePage.isLoaded(), 'Recipe page is NOT loaded');

            let afterSaveRecipeCount = RecipePage.getRecipeCount();

            assert.equal(afterSaveRecipeCount, beforeSaveRecipeCount + 1,  'Recipe count does NOT match');
            assert.equal(RecipePage.getSavedRecipeID(), CookingPage.recipeCardID, 'Saved Recipe ID\'s do NOT match');
            browser.eyesClose(false);
        } catch (err) {
            console.log('failure');
            console.log(err);
            browser.eyesClose(true);
        }

    });

    it('Verify Un-saving Recipe', function () {
        try {
            browser.reload();
            browser.eyesOpen('Verify Un-saving Recipe');
            scrollPage(); //CME
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
            browser.eyesCheckWindow('Cooking Recipe Box');

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
            browser.eyesClose(false);
        } catch (err) {
            console.log('failure');
            console.log(err);
            browser.eyesClose(true);
        }

    });
});



function scrollPage(){
    //CME
    let pageLen = browser.execute('var body = document.body, \
    html = document.documentElement; \
    return Math.max( body.scrollHeight, body.offsetHeight, \
            html.clientHeight, html.scrollHeight, html.offsetHeight );');
    const sectionLen = 400;
    let sections = pageLen.value/sectionLen; 
    for(let i=1;i<sections;i++){
        browser.scroll(0,sectionLen*i);
        browser.pause(500);
    }
    browser.scroll(0,0);
}