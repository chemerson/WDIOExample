const globals = require('./globals.js');
let md5 = require('blueimp-md5');

module.exports = {

    setBrowser() {
        const browser = process.env.BROWSER || 'chrome';

        if (browser === 'ie') {
            browser = 'internet explorer';
        }
        return browser;
    },

    setDevice() {
        const suite = process.argv[process.argv.indexOf('--suite') + 1];
        const grepVal = process.env.GREP || null;

        //User is asking the runner to run tests which match mobile/tablet tests on a non chrome browser
        if ((grepVal === 'mobile' || grepVal === 'tablet') && this.setBrowser() !== 'chrome') {
            throw Error(`mobile/tablet tests can only be run on chrome browser, you have set browser to ${process.env.BROWSER}`);
        }

        //User is asking the runner to run mobile or tablet test suite on a non chrome browser
        if((suite === 'mobile' || suite === 'tablet') && this.setBrowser() !== 'chrome' ) {
            throw Error(`mobile/tablet test suite can only be run on chrome browser, you have set browser to ${process.env.BROWSER}`);
        }

        //User has chosen the device as mobile or tablet but on a non chrome browser
        if((process.env.DEVICE === 'mobile' || process.env.DEVICE === 'tablet')&& this.setBrowser() !== 'chrome') {
            throw Error(`mobile/tablet tests can only be run on chrome browser, you have set browser to ${process.env.BROWSER}`);
        }

        if(suite === 'mobile' || grepVal === 'mobile') {
            return 'mobile';
        }
        if(suite === 'tablet' || grepVal === 'tablet') {
            return 'tablet';
        }
        return process.env.DEVICE;
    },

    setChromeOptions() {
        const device = this.setDevice();
        if(this.setBrowser()!== 'chrome') {
            return null;
        }
        if (device === 'tablet') {
            return globals.TABLETCHROMEOPTIONS;
        } else if (device === 'mobile') {
            return globals.MOBILECHROMEOPTIONS;
        } else if (device === 'headless') {
            return {
                args: ['--headless', '--disable-gpu']
            };
        }
    },

    getSauceJobAuthToken: function (sauceJobId) {
        let authToken;
        authToken = md5(sauceJobId, `${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}`);
        return authToken;
    }
};
