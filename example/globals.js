module.exports = {
    /*
  * Global Settings for Example Test Suite
  * Example Test File: /test/testSuite2.js
  * Documentation: https://docs.google.com/document/d/1xu4ZlrHPT2NP3Dqdm3L3UL_DcIiL5gU5sg09zPBGAAE/edit?usp=sharing
  */

    /*
  * Wait time
  * Example: userHub.loginLink.waitForExist(globals.WAITFORTIMEOUT);
  */
    // Default timeout for all waitFor* commands.
    WAITFORTIMEOUT: 30000,

    /*
  * How many pixels to scroll for various purposes
  * Example: browser.scroll(0, globals.SCROLLTOMOBILEFOOTER);
  */
    SCROLLTOMOBILEFOOTER: 20000,

    /*
  * Environment URLs
  * Example: // define default homepage URL in wdio.conf.js
  *          let baseUrl = globals.STAGINGURL
  */
    STAGINGURL: 'https://cooking.stg.nytimes.com',
    PRODURL: 'https://cooking.nytimes.com',
    DEVURL: 'https://cooking.dev.nytimes.com',

    /*
  * Cookies
  * Example: browser.setCookie({ name: globals.EXAMPLECOOKIENAME, value: globals.EXAMPLECOOKIEVALUE });
  */
    EXAMPLECOOKIENAME: 'NYT-Example',
    EXAMPLECOOKIEVALUE: '00.000',

    /*
  * Device names for mobile emulation on Chrome
  * Example: // supply mobile chrome options in wdio.conf.js
  *          chromeOptions: globals.MOBILECHROMEOPTIONS
  */
    MOBILECHROMEOPTIONS: { mobileEmulation: { deviceName: 'iPhone 6' } },
    TABLETCHROMEOPTIONS: { mobileEmulation: { deviceName: 'iPad' } },

    /*
  * Number of retries for test cases
  * Example: describe('Example describe block', () => {
  *            it('Example block with minimal retries', () => {
  *              // some awesome test code
  *            }, globals.MINRETRIES);
  *
  *            it('Example block with extra retries', () => {
  *              // some awesome test code
  *            }, globals.EXTRARETRIES);
  *          });
  */
    MINRETRIES: process.env.RETRY || 0,   //CME 3
    EXTRARETRIES: 6
};
