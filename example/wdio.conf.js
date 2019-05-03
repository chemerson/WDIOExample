// Usage:
// npm run test
// By default test runs on the local selenium node, browser chrome
// platform is the same as the OS on which the test is run
// test application environment is staging
//
// SELENIUM_HOST=sauce npm run test
// Test runs on SauceLabs, browser chrome, any platform chosen by Saucelabs

// Slack notification
// Configure this value to point to the relative location of the reporter
// node_modules/NYTimesWebdriverIO/reporter/slackReporter.js
const slackReporter = require('../reporter/slackReporter.js');

// NYT Test Reporting System
const trsReporter = require('wdio-reportportal-reporter');

//import custom commands module
const commands = require('~/../../customCommands/commands.js');
const cookingCommands = require('~/../../customCommands/cooking/commands.js');
// Globals file that contains commonly used variables
const globals = require('./globals.js');
// Utils file contains all the utilities and helper methods
const utils = require('./utils.js');

// Default test application environment
let testEnv = process.env.TESTENV || 'prod'; // CME 'stage';
let baseUrl = globals.STAGINGURL;
if(testEnv === 'prod') {
    baseUrl = globals.PRODURL;
} else if(testEnv === 'dev') {
    baseUrl = globals.DEVURL;
}

let timeout = process.env.DEBUG ? 99999999 : 1000000;
let execArgv = process.env.DEBUG ? ['--inspect'] : undefined;
let parallelThreads = process.env.DEBUG ? 1 : process.env.PARALLELTHREADS || 10;

// Browser/Platform configuration
let browserName = utils.setBrowser();
let platform = process.env.PLATFORM || 'LINUX'; // CME 'Windows 8';
let browserVersion = process.env.BROWSERVERSION || '';

// Set chromeOptions if browser is Chrome else set it to null
let chromeOptions = null || utils.setChromeOptions();

let device = utils.setDevice();

// Config for SauceLabs
let sauceUser = '';
let sauceKey = '';
let sauceConnect = false;
let tunnelIdentifier =  process.env.SAUCE_TUNNEL_IDENTIFIER || process.env.TI || 'timestunnel' ;
let parentTunnel =  process.env.SAUCE_PARENT_TUNNEL || process.env.PT || 'SauceRoot';
// When test runs on Saucelabs providing the 'build' capability will have the tests logs
// appear under the "Automated Build" tab on SauceLabs dashboard.
// It is optional and if not set, the test run will appear under the "Automation Runs" tab.
let build = '';
//timeZone variable is used by Saucelabs
let timeZone = 'New York';
// https://saucelabs.com/news/sauce-labs-launches-extended-debugging-tools-for-selenium-tests
// To generate the JS console logs and HAR files, you need to set the extendedDebugging capability to true
let extendedDebugging = false || process.env.EXTENDDEBUG;

let services = '';

// Initialize HTTP protocol, defaults to HTTP
let protocol = 'http';

// Initialize Selenium host
let host = '';

// Initialize Selenium host port, defaults to 4444
let port = 4444;

// Initialize docker logs
let dockerLogs = '';

// Initialiaze docker options
let dockerOptions = {};

if (process.env.SELHOST === 'sauce' || process.env.SELENIUM_HOST === 'sauce' ) {
    if(process.env.SAUCE_USERNAME === undefined || process.env.SAUCE_ACCESS_KEY === undefined) {
        throw new Error('Error| To run on saucelabs set the environment variables SAUCE_USERNAME and SAUCE_ACCESS_KEY');
    }
    // If the environment variables are set then the test runs on Saucelabs
    console.log('This test will run remotely on SauceLabs.');
    sauceUser = process.env.SAUCE_USERNAME;
    sauceKey = process.env.SAUCE_ACCESS_KEY;
    services = ['sauce'];

    if (process.env.CT||process.env.SAUCE_CREATE_TUNNEL) {
        // User wants webdriverio to take care of handling the tunnel setup and teardown process
        // Webdriverio starts the tunnel to saucelabs if sauceConnect is set to true
        // This is useful in cases where the shared tunnel is not accessible from the
        // where the test is being launched
        sauceConnect = true;
        //setting tunnel information to null since sauceConnect will take care of it.
        tunnelIdentifier = '';
        parentTunnel = '';
    }

    // Jenkins has an environment variable JOB_NAME
    // We use this to initilazise the build capability of Saucelabs
    // If the test is being run outside Jenkins or an environment where JOB_NAME is not defined
    // then we can set the capability 'build' to a value or leave it undefined.
    build = process.env.JOB_NAME ? (`${process.env.JOB_NAME}:${process.env.BUILD_NUMBER}`) : (`ExampleWebdriverio : ${ Date()}`);
    protocol = 'https';
    host = 'ondemand.saucelabs.com';
    // SauceLabs port 4444 is blocked from office network
    port = 443;

} else if (process.env.SELHOST === 'STANDALONE_CHROME') {
    console.log('This test will run on docker selenium node.');
    host = 'selenium-tat';
} else if (process.env.SELHOST === 'WDIO_STANDALONE_CHROME_DEBUG') {
    console.log('This test will run using docker service provided by WebDriverIO using standalone-chrome-debug image.');
    services = ['docker'];
    host = 'localhost';
    dockerLogs = './dockerLogs';
    dockerOptions = {
        image: 'selenium/standalone-chrome-debug',
        healthCheck: 'http://localhost:4444',
        options: {
            p: ['4444:4444', '5901:5900'],
            shmSize: '2g'
        }
    };
} else {
    console.log('This test will run on the local selenium node.');
    const applitoolsEyes = require('wdio-eyes.selenium-service');
    services = ['selenium-standalone', applitoolsEyes];
    host = 'localhost';
}

exports.config = {

    //
    // =================
    // Service Providers
    // =================
    // WebdriverIO supports Sauce Labs, Browserstack, and Testing Bot (other cloud providers
    // should work too though). These services define specific user and key (or access key)
    // values you need to put in here in order to connect to these services.
    // Set the teams sauce username and accesskey in your environment
    user: sauceUser,
    key: sauceKey,
    sauceConnect : sauceConnect,

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: services,

    applitools: {
        apiKey: '18IoQ102FEtR31VdC75SpLe1104gLDNp110QBdSSEDgQeoto8110',                // nytimeseyes Required
        appName: 'Cooking',                             //Recommended
        viewport: {width: 1111, height: 650},       //Recommended for web, don't use in mobile
        batchName: 'NYT Cooking',                  //Optional
        globalMatchLevel: "Layout",                 //Optional
        //disableCSSScrolling: false,                  //Optional
        disableFullPageScreenshot: true,            //Optional
        serverUrl: 'https://nytimeseyes.applitools.com/',  //Optional
        sendDom: false,
        useEyesWDIO: true                           //Optional, Use Applitools new WDIO sdk under the hood
    },

    // Override default HTTP protocol to HTTPS for SauceLabs
    protocol: protocol,

    // Override default host(localhost) to point to docker selenium service host
    host: host,

    // Override default 4444 port to SauceLabs which is blocked from office network to 443
    port: port,

    // Set docker log path
    dockerLogs: dockerLogs,

    // Set docker options
    dockerOptions: dockerOptions,

    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        //CME './example/test/**/*.js'
        './example/test/visual*.js'
    ],

    /*
    CME
    // Patterns to exclude.
    exclude: [
        //comment out the tests from here, to run these
        './example/test/reportPortalTest.js',
        './example/test/userManagementTool/getUsersfromUMT.js',
        './example/test/userManagementTool/createUser.js'
    ],
    suites : {
        mobile: ['./example/test/crossViewportTest.js'],
        tablet: [
            './example/test/crossViewportTest.js'
        ],
        smoke: ['./example/test/smokeTest.js']
    },

    */


    device : device,
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: parallelThreads,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    //
    capabilities: [{
        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: parallelThreads,
        browserName: browserName,
        platform: platform,
        version: browserVersion,
        parentTunnel: parentTunnel,
        tunnelIdentifier: tunnelIdentifier,
        build: build,
        timeZone: timeZone,
        extendedDebugging: extendedDebugging,
        chromeOptions: chromeOptions,
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // e.g. using promises you can set the sync option to false.
    sync: true,
    //
    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'silent',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Warns when a deprecated command is used
    deprecationWarnings: true,
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: baseUrl,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: globals.WAITFORTIMEOUT,
    //
    // Default timeout in milliseconds for request
    // if SAUCELABS doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Initialize the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as properties. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },
    //

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    // see also: https://docs.google.com/document/d/1WN_y-jKN5xGKsFqGClv5o03ZflJ1wPFgHZAgC09_SQ8/edit?usp=sharing
    framework: 'mocha',
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: http://webdriver.io/guide/reporters/dot.html
    reporters: ['dot', slackReporter, 'allure', 'spec'],
    reporterOptions: {
        allure: {
            outputDir: 'allure-results'
        },
        slackReporter: {
            // Slack notification is set to true by default
            notify: process.env.SLACK || true,
            webhook: process.env.SLACK_WEBHOOK,
            // notifyOnlyOnFailure - Set this to true to send notifications only when there are test failures
            // otherwise the test summary will be sent even if all tests pass.
            notifyOnlyOnFailure: process.env.SLACK_FAILURE_ONLY || false,
            // The value username will appear in the slack notification as the user who sent it.
            username: `${'tat-webdriverIO'}: ${testEnv} ${platform} ${browserName}${browserVersion}`,
            // An optional message to include at the top of the notification
            message: 'This is an optional message',
            // Optional: Provide a link to the results
            results: process.env.JENKINS_URL,
            // Optional - Provide an auth code which is appended to saucelabs results link
            // This is done so that the link can be accessible without logging in to SL.
            // sauceAuthToken: sauceAuthToken || ''
        },
        reportportal: {
            rpConfig: {
                //token will be removed when we move to production version
                token: process.env.REPORT_PORTAL_UUID,
                endpoint: 'https://testreportingsystem-api.nyt.net/api/v1',
                launch: `${'tat-webdriverIO'}: ${testEnv} ${platform} ${browserName}${browserVersion}`,
                project: 'TESTAUTOMATIONTEAM',
                mode: 'DEFAULT',
                description: 'TAT WebdriverIO',
                tags: ['tags', 'for', 'launch'],
            },
            enableSeleniumCommandReporting: false,
            enableScreenshotsReporting: true,
            seleniumCommandsLogLevel: 'debug',
            screenshotsLogLevel: 'info',
            enableRetriesWorkaround: true,
            parseTagsFromTestTitle: true,
            debug: false,
        }
    },
    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: timeout,
        compilers: ['js:babel-register'],
        grep: process.env.GREP
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },

    /**
     * Arguments passed to the node wdio process at runtime
     */
    execArgv: execArgv,

    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        // see: https://docs.google.com/document/d/1WN_y-jKN5xGKsFqGClv5o03ZflJ1wPFgHZAgC09_SQ8/edit?usp=sharing
        expect = require('chai').expect;
        assert = require('chai').assert;
        require('babel-core/register');
        Page = require('./pageobjects/page');

        //add commands from commands.js
        Object.keys(commands).forEach(key => {
            browser.addCommand(key, commands[key]);
        });

        //add commands from cookingCommands
        Object.keys(cookingCommands).forEach(key => {
            browser.addCommand(key, cookingCommands[key]);
        });
    },

    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },

    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     */
    // beforeTest: function (test) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function () {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function () {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) ends.
     * @param {Object} test test details
     */
    afterTest: function (test) {
        if (test.passed) {
            const passMsg = ` TEST '${test.title}' PASSED  `;
            trsReporter.sendLogToTest(test, 'info', passMsg);
        } else {
            const failMsg = ` TEST '${test.title}' FAILED `;
            trsReporter.sendLogToTest(test, 'info', failMsg);
            const screenshot = browser.saveScreenshot();
            trsReporter.sendFileToTest(test, 'info', `${test.title}.png`, screenshot);
        }
    },
    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },

    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onComplete: function(exitCode, config, capabilities) {
        const reporters = config.reporters;
        if (reporters.includes('reportportal')) {
            const projectName = config.reporterOptions.reportportal.rpConfig.project;
            const trsLaunchId = trsReporter.launchId;
            console.log(`Test reporting link for this launch: https://testreportingsystem.nyt.net/ui/#${projectName}/launches/all/${trsLaunchId}`);
            return new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};
