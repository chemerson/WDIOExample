const globals = require('../globals');
// Example test file that uses global variables
// To run on desktop (default): npm run test -- --spec=example/test/globalsTest.js
//                          or: DEVICE=desktop npm run test -- --spec=example/test/globalsTest.js
// To run on tablet: DEVICE=tablet npm run test -- --spec=example/test/globalsTest.js
// To run on mobile: DEVICE=mobile npm run test -- --spec=example/test/globalsTest.js


describe('Globals Test Suite', function() {

    it('Navigate to development environment', function() {
        browser.url(globals.DEVURL);
    }, globals.MINRETRIES);

    it('Navigate to staging environment', function() {
        browser.url(globals.STAGINGURL);
    }, globals.EXTRARETRIES);

    /*it('Navigate to production environment', function() {
        browser.url(globals.PRODURL);
    }, globals.EXTRARETRIES);*/
});
