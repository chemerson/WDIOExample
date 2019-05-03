const CookingPage = require('../pageobjects/cookingPage');

/*
To run this test in mobile viewport:
DEVICE=mobile npm run test -- --spec example/test/crossViewportTest.js

To run this test in tablet viewport:
DEVICE=tablet npm run test -- --spec example/test/crossViewportTest.js

To run this test in desktop viewport:
npm run test -- --spec example/test/crossViewportTest.js

How to choose to run only the mobile viewport or tablet viewport tests?

Solution 1:
This test demonstrates how to choose only the mobile or tablet specific tests using mochas grep option.
Provide the query mobile,tablet if the test can run on those viewports in the test name
-device tablet
-device mobile,tablet
-device mobile

Note: This is not a good approach since for every test file present a browser session is opened and closed
adding additional time to your run.

To run all mobile specific tests:
GREP=mobile npm run test

Solution 2:
In wdio.conf.js create a suite for mobile, tablet and run that suite
npm run test -- --suite mobile
*/

describe('Test Suite for demonstrating how to leverage desktop tests to other viewports\n', function () {

    it('Find the login button and click on it -devices mobile,tablet', function () {
        CookingPage.open();
        CookingPage.login();
    });
});
