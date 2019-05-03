const globals = require('../globals');
const CookingPage = require('../pageobjects/cookingPage');

//This is a test file which covers usage of custom commands provided by nyt-webdriverIO
describe('Test Suite for custom command usage', function() {
    const pageUrl = 'https://cooking.stg.nytimes.com/recipes/1019020-fudgy-chocolate-hazelnut-brownies';
    it('Testcase which calls a custom assertion', function() {
        browser.url('');
        //This command fetches the https response code of a page provided by the user.
        const responseCode = browser.getHttpsResponseCode(pageUrl);
        assert.equal(responseCode, 200, `Verify response code is 200 for page: ${pageUrl}`);
    }),

    //     it('Testcase which calls a custom assertion and is expected to fail', function() {
    //         browser.url('');
    //         const responseCode = browser.getHttpsResponseCode(pageUrl);
    //         assert.equal(responseCode, 300, `Verify response code is 200 for page: ${pageUrl}`);
    //     }),

    it('Testcase which calls mouse over element - newsletter signup', function() {
        // Skipping test in firefox, getting out of viewport error. https://github.com/mozilla/geckodriver/issues/1123
        if(browser.desiredCapabilities.browserName != 'firefox') {
            browser.url('');
            browser.mouseOverElement(CookingPage.newsLetterSignUpEmail);
        } else {
            this.skip();
        }
    });

    it('Testcase which calls mouse over element with offset - newsletter signup', function() {
        // Skipping test in firefox, getting out of viewport error. https://github.com/mozilla/geckodriver/issues/1123
        if(browser.desiredCapabilities.browserName != 'firefox') {
            browser.url('');
            browser.mouseOverElement(CookingPage.newsLetterSignUpEmail, 1, 1);
        } else {
            this.skip();
        }
    });
});
