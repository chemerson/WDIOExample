const globals = require('../globals');
const CookingPage = require('../pageobjects/cookingPage');
const LoginPage = require('../pageobjects/loginPage');

describe('Test Suite for reportportal', function () {

    this.retries(globals.MINRETRIES);

    it.skip('Test should skip', function () {
        CookingPage.open();
    });

    it('Test should pass', function () {
        CookingPage.open();
        CookingPage.login();
        assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');
    });

    it('Test should fail', function () {
        CookingPage.open();
        assert.isTrue(LoginPage.isLoaded(), 'Login page is NOT loaded');
    });

});
