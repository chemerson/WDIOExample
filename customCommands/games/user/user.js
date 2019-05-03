const fs = require('fs-extra');
const path = require('path');

let checkedOutUsers = [];

exports.pool = {
    _testName: '',
    _testBrowser: '',
    _sessionId: '',
    _appEnv: 'stage', // stage by default, can be set to use another environment

    // Removes a user object from user.json to be used for a test
    get nextFreeUser() {
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, `temp/user-${this._testBrowser}.json`)));
        console.log(`Checking out user ${users[this._appEnv][0].id} for test '${this._testName}' (session id: ${this._sessionId})`);
        let checkedOutUser = users[this._appEnv].shift();
        fs.writeFileSync(path.join(__dirname, `temp/user-${this._testBrowser}.json`), JSON.stringify(users));
        if (!checkedOutUser) {
            expect(false, `Error: no test users available to be used from user pool`).to.equal(true);
        }
        checkedOutUser.testName = this._testName;
        checkedOutUsers.push(checkedOutUser);
        return checkedOutUser;
    },

    clean() {
        // Clean user pool
        try {
            fs.removeSync(path.join(__dirname, `temp`));
        } catch (err) {
            console.log(`No temp user directory exists: ${err}`);
        }
    },

    init() {
        // Create user pool file from backup, if necessary
        try {
            fs.ensureDirSync(path.join(__dirname, `temp`));
        } catch (err) {
            console.log(`Error during creation of temp user file directory: ${err}`);
        }

        try {
            fs.statSync(path.join(__dirname, `temp/user-${this._testBrowser}.json`));
        } catch (err) {
            let users = fs.readFileSync(path.join(__dirname, `user-backup-${this._testBrowser}.json`));
            fs.writeFileSync(path.join(__dirname, `temp/user-${this._testBrowser}.json`), users);
        }
    },

    // Replaces the user object at the end of the queue of test users, re-writing user.json
    returnUser(user) {
        let checkedOut = true;
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, `temp/user-${this._testBrowser}.json`)));
        users[this._appEnv].forEach(userOnFile => {
            if (userOnFile.id === user.id) {
                checkedOut = false;
            }
        });
        if (checkedOut) {
            let userIndex = checkedOutUsers.map(checkedOutUser => { return checkedOutUser.id; }).indexOf(user.id);
            if (userIndex !== -1) {
                checkedOutUsers.splice(userIndex, 1);
            }
            let namelessUser = {
                id: user.id,
                xwdCookie: user.xwdCookie,
                regiId: user.regiId,
            };
            console.log(`Returning user ${user.id} from test '${this._testName}' (session id: ${this._sessionId})`);
            users[this._appEnv].push(namelessUser);
            fs.writeFileSync(path.join(__dirname, `temp/user-${this._testBrowser}.json`), JSON.stringify(users));
        }
    },

    returnTestUsers(testName) {
        checkedOutUsers.forEach((checkedOutUser) => {
            if (checkedOutUser.testName === testName) {
                this.returnUser(checkedOutUser);
            }
        });
    },

    setTestName(name) {
        this._testName = name;
    },

    setTestBrowser(browser) {
        this._testBrowser = browser;
    },

    setSessionId(id) {
        this._sessionId = id;
    },

    setAppEnv(env) {
        this._appEnv = env;
    }
};
