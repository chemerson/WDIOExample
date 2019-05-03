//The tests are commented out intentionally so that we do not see failures.
// To test how retries works uncomment the it blocks and run this test file

describe('Verify retries with sync and async custom commands', function() {
    this.retries(1);

    // it('Example of retry in a test', function() {
    //     browser.url('https://cooking.nytimes.com/');
    //     browser.click('a[href*="/learn-to-cook?"]');
    //     browser.waitForExist('#foo');
    // });

    // it('Example of retry in a SYNC custom command', function() {
    //     // retries currently do not work with synchronous custom commands
    //     // See issue https://github.com/webdriverio/webdriverio/issues/2320
    //     browser.url('https://cooking.nytimes.com/');
    //     browser.click('a[href*="/learn-to-cook?"]');
    //     browser.fooSync();
    // });

    // it('Example of retry in an ASYNC custom command', function() {
    //     browser.url('https://cooking.nytimes.com/');
    //     browser.click('a[href*="/learn-to-cook?"]');
    //     browser.fooAsync();
    //     console.log('It should not get print');
    // });
});
