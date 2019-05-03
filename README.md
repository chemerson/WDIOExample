## Table of Contents
- [Synopsis](#synopsis)
- [Setup Instructions](#setup-instructions)
  * [Installation](#installation)
  * [How to execute example tests](#how-to-execute-example-tests)
  * [How to develop test automation for your project](#how-to-develop-test-automation-for-your-project)
- [Supporting Documentation](#supporting-documentation)
- [Support and Communication](#support-communication)
  * [Slack](#slack)
  * [Contributing](#cntributing)
  * [Questions](#questions)
  * [Troubleshooting](#troubleshooting)


## Synopsis

This repository contains shared modules, plugins, custom commands, documentation and examples of webdriverIO for the NYTimes. Please read [this](https://github.com/nytm/nyt-webdriverIO/wiki/Getting-started-with-webdriverIO) guide if you are new to webdiverIO. 


## Setup Instructions


## Installation

1. You can simply do it by:

```
npm install nytm/nyt-webdriverIO.git --save-dev
```

2. Or you can add `nyt-webdriverIO` as a devDependency in your `package.json` and run `npm install`. **Please do not include dependencies listed in nyt-webdriverIO's [package.json](https://github.com/nytm/nyt-webdriverIO/blob/master/package.json) again in your project's package.json**

```json
{
  "devDependencies": {
    "nyt-webdriverIO": "nytm/nyt-webdriverIO.git",
  }
}
```

3. If you want to try it out independent of any dev proejct:
```
git clone https://github.com/nytm/nyt-webdriverIO.git
cd nyt-webdriverIO
npm install
npm run test
```

This will install the packages listed in [package.json](https://github.com/nytm/nyt-webdriverIO/blob/master/package.json) into your projects node_modules folder. That includes all the libraries needed to run a test in webdriverIO.


## How to execute example tests

To get started off follow the instructions in the [README.md](https://github.com/nytm/nyt-webdriverIO/blob/master/example/README.md) of the example folder.

## How to develop test automation for your project

To start developing test automation using this repo for your project copy over the example folder to your projects functional tests folder.

```
cp -r node_modules/nyt-webdriverIO/example/ tests/functional
```

Run the following command from your projects top level
```
wdio tests/functional/wdio.conf.js
```

Errors which appear are related to path resolution. Edit your projects wdio.conf.js (```tests/functional/wdio.conf.js```) to use the common modules provided by this repository.

1. Change the path to slack reporter:
```
./node_modules/NYTimesWebdriverIO/reporter/slackReporter.js
```

2. Change the path to the base page:
```
./node_modules/NYTimesWebdriverIO/example/pageobjects/page.js
```

2. Provide the spec file location:
```
./tests/functional/tests**/*.js
```

3. Add this script to your package.json
```
"test": "wdio tests/functional/wdio.conf.js"
```

4. Start developing your tests and place them under the folder tests/functional/tests

5. If you are adding project specific custom commands place them in a directory under the <a href='./customCommands/'>customCommands directory</a>. See <a href='./customCommands/cooking/commands.js'>customCommands/cooking/commands.js</a>. The custom command deleteRecipe is invoked in the <a href='./example/test/CookingTests.js/'>Cooking Test example</a>.

6. Now to run your tests use ```npm run test```


## Supporting Documentation

Our <a href='https://github.com/nytm/nyt-webdriverIO/wiki/'>wiki</a> is (mostly) up to date and contains most of the detailed supporting information you may need to know. Some of the documents are just a recommendation from TAT team, please do not hesitate to provide your feedback by commenting on these documents.


## Support and Communication


## Slack

Please join the <a href='https://nytimes.slack.com/messages/test_automation/'>test_automation</a> channel for announcements, general conversation, and exploratory questions specific to WebdriverIO.


## Contributing

We encourage you to file issues to ask questions or propose improvements! Alternatively, you are welcome to [open a PR](CONTRIBUTING.md)!


## Questions


## Troubleshooting

For debugging commonly encountered problems, see <a href='https://docs.google.com/document/d/1f2Wnm8YJ6JyBPCRKbBXLz0Ga6EIW4Viwc8GQzppf2Ds/'>here</a>.
