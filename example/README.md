# Example Test Suite

Please use this README as a template for your projects test README to maintain a similar view across the company for test automation.

## Synopsis

This directory contains example tests written in node.js and they run against a selenium server using webdriverIO framework.


## Organization

The page objects used by the tests are in the directory example/pages.

The test files are in the directory example/tests.

## Roadmap


## Quick Start

Clone, npm install and run this project from the root directory of nyt-webdriverIO.

```
1. git clone https://github.com/nytm/nyt-webdriverIO.git
2. npm install
3. npm run test
```

## Installation

You can either clone this repository independently or install it in your development project.

1. If you want to try it out independent of any dev project:

```git clone https://github.com/nytm/nyt-webdriverIO.git
cd nyt-webdriverIO
npm install
npm run test
```


2. To install it into your development project:

```
npm install nytm/nyt-webdriverIO.git --save-dev
```
**Please do not include dependencies listed in nyt-webdriverIO's [package.json](https://github.com/nytm/nyt-webdriverIO/blob/master/package.json) again in your project's package.json**

## Test Execution

For executing all the tests specified in wdio.conf, run the wdio executable from the root directory nyt-webdriverIO:

```wdio example/wdio.conf.js```

or

```npm run test```

### Running tests on SauceLabs
``` SELHOST=sauce npm run test ```

  More info in the Saucelabs section.
  

## Configuration

The configuration file is:
``` example/wdio.conf.js ```

Default test settings :
By default the test runs on the local machine, chrome browser on a staging application.
Slack notifications are not enabled.

## Test Options

The following environment variables can be set to control your test settings.
Export the environment variable to your profile or pass it to your tests environment as shown in the below cases.


### 1. Test Environment

``` TESTENV: [stage, prod, dev] ```

This variable is used to control the applications environment. By default it points to staging.


### 2. Browser/Platform Options

``` BROWSER: [chrome, firefox, safari, IE] ```

``` BROWSERVERSION, PLATFORM ```

Refer to the SauceLabs [platform configurator](https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/) for the values to provide

The default for the above three variables are chrome, '' , '' respectively.

### 3. Selenium Host Options

```SELHOST/SELENIUM_HOST:  [sauce] ```

``` SELENIUM_HOST=sauce npm run test ```

If unspecified tests are run on your local machine.
If you provide the value "sauce" the test will run on SauceLabs.
More about running the test on SauceLabs is covered in the SauceLabs section.

### 4. Saucelabs

To run your tests on SauceLabs set the SAUCE_USERNAME and SAUCE_ACCESS_KEY variables in your environment.

```
export SAUCE_USERNAME="username"
export SAUCE_ACCESS_KEY="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
```

The default SauceConnect Tunnel  is the shared tunnel running on the QA slaves and the values are set in the config file.
Tests will run through them if user does not provide any value.

``` SAUCE_CREATE_TUNNEL/CT ```

In the case where the shared tunnels are not accessible, you may want to create your own tunnel.
In that case set the variable SAUCE_CREATE_TUNNEL to true. wdio-sauce-service takes care of tunnel creation and deletion for your test.

```
SAUCE_CREATE_TUNNEL=true npm run test
```
### 5. NYT Test Reporting System (reportportal) Reporter
For integrating with [NYT-TRS](https://github.com/nytm/tat-reportportal) please follow [this](https://docs.google.com/document/d/1vpAN716v_n_VL2IllV0CgNa-ZsF_MQ13DRybjcCNLLo) document about How you can get access to it. You need to append ```-- --r reportportal ``` to your script for enabling reportportal reporter. For e.g. in this repo ``` npm run test -- --r reportportal ```

### 6. Slack Reporter

By default slack notifications is on.
However the webhook for the slack channel is not set, so notifications will not be sent.

``` export SLACK_WEBHOOK = 'https://slack.xxxxxxxxx' ```

or

``` SLACK_WEBHOOK='https://slack.xxxxxxxxx' npm run test ```

To turn off notifications:

``` SLACK=false npm run test ```

### 7. Cross Viewport Testing Options

Tests can be run on mobile/tablet viewport using chrome browser if the pageobjects for the DOM elemnent are created and logic is in place.

To run one test in mobile viewport:

``` DEVICE=mobile npm run test -- --spec example/test/crossViewportTest.js ```

To run one test in tablet viewport:

``` DEVICE=tablet npm run test -- --spec example/test/crossViewportTest.js ```

## Other ways to run tests

### Running Specific set of tests

For executing specific set of tests you have two options as described [here](https://docs.google.com/document/d/1s4i7wkH6yv4OKocDJ9sWNx348wQUhvMi7HiWEGPG9aY). Please choose one based on your requirement and organize your tests accordingly.

- Please find below details about using one of the option (Mocha’s grep):
   * Running smoke tests for all the features in the project ``` GREP='smoke' npm run test ```
   * Running regression tests for all the features in the project ``` GREP='regression' npm run test ```
   * Running only smoke tests for particular feature ``` GREP='smoke-feature summary' npm run test ```
   * Running only regression tests for particular feature ``` GREP='regression-feature summary' npm run test ```
   * Running both smoke and regression tests for particular feature ``` GREP='feature summary' npm run test  ```
   
#### How to choose to run only the mobile viewport or tablet viewport tests?

Solution 1:
This test demonstrates how to choose only the mobile or tablet specific tests using mochas grep option.
Provide the query mobile,tablet if the test can run on those viewports in the test name

``` -device tablet
-device mobile,tablet
-device mobile 
```

Note: This is not a good approach since for every test file present a browser session is opened and closed
adding additional time to your run.

To run all mobile specific tests:

``` GREP=mobile npm run test ```

Solution 2:
In wdio.conf.js create a suite for mobile, tablet and run that suite. 
``` npm run test -- --suite mobile ```

### Running a Single Test
To run a single test file from the root directory nyt-webdriverIO:

```npm run test -- --spec=example/test/exampleTest.js```

## Jenkins

An example Jenkins job lauching test/cookingTests.js using SauceLabs and Allure reporting can be found at [Jenkins TA ta-webdriverIO]('https://jenkins.nyt.net/jenkins/job/TA/job/ta-webdriverIO/')

