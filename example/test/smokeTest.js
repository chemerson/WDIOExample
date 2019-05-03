const assert = require('chai').assert;
const globals = require('../globals');
const config = require('../wdio.conf.js').config;
const CookingPage = require('../pageobjects/cookingPage');
const LoginPage = require('../pageobjects/loginPage');
const SignUpPage = require('../pageobjects/signupPage');

describe('Smoke Test Suite for cooking site navigation', function () {

    this.retries(globals.MINRETRIES);

    it('Verify opening cooking home page', function () {
        CookingPage.open();
    });
});
