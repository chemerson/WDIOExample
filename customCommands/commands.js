const syncRequest = require('sync-request');
const moment = require('moment');
const axios = require('axios');

const UMT='https://seg-qa-tools.dev.nyt.net/api/v1/';

module.exports = {
    getHttpsResponseCode: function (host, request = 'GET') {
        let response = syncRequest(request, host);
        return response.statusCode;
    },

    //Sync custom command
    fooSync: function () {
        console.log('in sync function');
        browser.waitForExist('#foo');
    },

    // Async custom command
    fooAsync: function async() {
        console.log('in async function');
        return browser.waitForExist('#foo');
        console.log('This step should not get execute');
    },

    // Mouse over element custom command
    mouseOverElement: function (element, x = 0, y = 0) {
        if (browser.desiredCapabilities.browserName === 'firefox')
            try {
                browser.actions([{
                    'type': 'pointer',
                    'id': 'finger1',
                    'parameters': { 'pointerType': 'mouse' },
                    'actions': [{
                        'type': 'pointerMove',
                        'origin': 'pointer',
                        'x': element.getLocationInView('x') + x,
                        'y': element.getLocationInView('y') + y
                    },
                    ]
                }]);
            } catch (err) {
                console.log(err);
                assert(0, `Error while mouse hover element in firefox - ${err}.`);
            }
        else
            element.moveToObject(x, y);
    },

    /**
     * Given an element classname, e.g. `.sb-message-box`, add an event listener to the first webelement found
     * with that class name, so that any subnodes added to that element will trigger the addition of a mutation event with the
     * subnode's details to an array on the global `window` object, at `window.trackedEvents`
     *
     * @param {string} selector - CSS selector for element to monitor
     * @param {string} eventName - unique string to identify queue of events for later parsing
     */
    trackElementSubnodes: function (selector, eventName) {
        browser.execute(function (selector, eventName) {
            window.trackedEvents = window.trackedEvents || {};
            window.trackedEvents[eventName] = window.trackedEvents[eventName] || [];
            let targetNode = document.querySelector(selector);
            let config = {
                attributes: true,
                childList: true,
                subtree: true,
            };
            let callback = function (mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        window.trackedEvents[eventName].push(mutation);
                    } else if (mutation.type === 'attributes') {
                        window.trackedEvents[eventName].push(mutation);
                    }
                }
            };

            window.observer = new window.MutationObserver(callback);

            window.observer.observe(targetNode, config);
        }, selector, eventName);
    },

    /**
     * Reset the `window.trackedEvents` object to be empty
     */
    clearTrackedEvents: function () {
        browser.execute(function () {
            window.trackedEvents = {};
        });
    },

    /**
     * Returns data from a row of local storage, given that row's key
     * @param {string} key
     */
    getFromLocalStorage: function (key) {
        return browser.execute(function (key) { return window.localStorage.getItem(key); }, key).value;
    },

    /**
     * Sets a single row of browser local storage given a key and its value
     * @param {string} key
     * @param {string} value
     */
    setLocalStorage: function (key, value) {
        browser.execute(`window.localStorage.setItem('${key}', '${value}')`);
    },

    /**
     * Removes a single row from local storage given that row's key
     * @param {string} key
     */
    removeFromLocalStorage: function (key) {
        browser.execute(`window.localStorage.removeItem('${key}')`);
    },

    /**
     * Returns the +/- number to append to UTC timezone strings
     * @param {int} tz
     */
    getTimeZoneUTCOffset: function (tz) {
        let offset = '';
        if (process.env.SAUCE_USERNAME) {
            let date = browser.execute(function () { return (new Date(Date.now())).toString(); }).value
                .replace(/ *\([^)]*\)/g, ''); // remove "helpful" last parens group, e.g. ' (Pacific Standard Time)'
            let offset = moment.parseZone(date).utcOffset() / 60;
            return offset;
        }
        if (tz === 0) {
            return offset;
        }
        offset += `${tz / -60}`;
        return offset;
    },

    /**
     * Navigates to a given URL, hitting 'Escape' key on timeout error (to cancel longloading pages)
     * @param {string} baseUrl
     * @param {boolean} is200 if is200 === true => verifies that page returns status code 200
     * Usage:
     * browser.navigateTo() navigates to default base URL
     * browser.navigateTo(true) navigates to default base URL and validates if page returns 200
     * browser.navigateTo('https://www.google.com', true) navigates to new URL and validates if page returns 200
     * browser.navigateTo('https://www.google.com') navigates to new URL without validation of page status code
     */
    navigateTo: async function (baseUrl, is200) {
        let url;
        let responseCode;
        try {
            url = (!baseUrl || typeof baseUrl === 'boolean') ? '/' : baseUrl;
            browser.url(url);
            if (is200) {
                responseCode = this.getHttpsResponseCode(browser.getUrl());
                assert.equal(200, responseCode, `Verify http response is 200`);
            }
        } catch (err) {
            browser.url('about:blank');
            browser.pause(2000);
            (is200) ? assert.equal(200, responseCode, `Error: ${err.message}. Could not navigate to url '${url}'. Http response code '${responseCode}'`) : assert.isOk(false, `Error: ${err.message}. Could not navigate to url '${url}'`);
        }
    },

    /**
     * Waits for an element to be visible and enabled before executing a click on it.
     * @param {*} element
     */
    waitAndClick: function (element) {
        try {
            this.waitUntil(() => {
                return (browser.isVisible(element.selector) && browser.isEnabled(element.selector));
            });
            element.click();
        } catch (err) {
            assert.isOk(false, `Error waiting and clicking on '${element.selector}' -- Error: '${err}'`);
        }
    },

    getGoogleApiToken: function() {
        return axios ({
            method: 'post',
            url:'https://www.googleapis.com/oauth2/v4/token',
            data: {
                client_id: process.env.UMT_CLIENT_ID,
                client_secret: process.env.UMT_CLIENT_SECRET,
                refresh_token: process.env.UMT_REFRESH_TOKEN,
                grant_type: 'refresh_token',
                audience: process.env.UMT_AUDIENCE,
            }
        });
        // .catch(function (error) {
        //     if (error.response) {
        //         // The request was made and the server responded with a status code
        //         // that falls out of the range of 2xx
        //         console.log(error.response.data);
        //         console.log(error.response.status);
        //         console.log(error.response.headers);
        //     } else if (error.request) {
        //         // The request was made but no response was received
        //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //         // http.ClientRequest in node.js
        //         console.log(error.request);
        //     } else {
        //         // Something happened in setting up the request that triggered an Error
        //         console.log('Error', error.message);
        //     }
        //     console.log(error.config);
        // })
    },

    getDigitalUser: function(options = {}) {
        const url = `${UMT}digital-user/get-user`;
        const apiToken = browser.getGoogleApiToken();
        return axios ({
            method: 'post',
            url:url,
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${apiToken.data.id_token}`,
            },
            data: options
        });
    },

    createDigitalUser: function(options = {}) {
        const url = `${UMT}process/generate-digital-users`;
        const apiToken = browser.getGoogleApiToken();
        return axios({
            method: 'post',
            url: url,
            headers: {
                Authorization: `Bearer ${apiToken.data.id_token}`,
            },
            data: options
        });
    }
};
