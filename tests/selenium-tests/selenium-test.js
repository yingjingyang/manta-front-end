const { By, Builder, until } = require('selenium-webdriver');
require('selenium-webdriver/testing');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const testHelper = require('./test-helpers.js');
const { exit } = require('process');

describe('Chrome Test', function() {
    this.timeout(300000);
    let driver;
    let browser = 'chrome'

    before(async function() {
        let options = await new chrome.Options();
    
        options.addArguments(`load-extension=../extension/packages/extension/build`);

        driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    });

    it('Chrome Test', async function() {
        await testHelper.installPolkadotJSExt(driver, browser);
        await driver.get('http://localhost:8000/');

        await testHelper.goToDolphin(driver);
    });
            
    after(() => {
        //driver.quit();
    });
});

describe('Firefox Test', function() {
    this.timeout(300000);
    let driver;
    const browser = 'firefox';

    before(async function() {
        let options = await new firefox.Options();
        options.addArguments("-no-remote");
        driver = await new Builder()
        .forBrowser(browser)
        .setFirefoxOptions(options)
        .build();

        // install alreadt downloaded addon
        await driver.installAddon('./extension.xpi');
    });

    it('Firefox Test', async function() {
        await testHelper.installPolkadotJSExt(driver, browser);
        await driver.get('http://localhost:8000/');
        
        await testHelper.goToDolphin(driver);
    });
            
    after(() => {
        //driver.quit();
    });
});
