const { By, Builder, until } = require('selenium-webdriver');

const firefoxExtVersionLocation = 'about:debugging#/runtime/this-firefox';
const chromeExtVersionLocation = 'chrome://system/';

const firefoxExtHTMLPrefix = 'moz-extension://';
const chromeExtHTMLPrefix = 'chrome-extension://';

async function getExtensionVersion(driver, extName, browser) {

    let polkadotJSExtensionVersion = '';
    switch (browser) {
        case 'chrome':
            await driver.get(chromeExtVersionLocation);
            // 'wait' until system info loads then read element
            let extensions_versions = await driver.wait(until.elementLocated(By.id('extensions-value'))).getText();
            let extensions = await extensions_versions.split('\n');
        
            //iterate versions
            for (let idx in extensions) {
                if (extensions[idx].includes(extName)){
                    // ext UUID is 32 length
                    polkadotJSExtensionVersion = extensions[idx].substring(0,32);
                    break;
                }
            }
            break;

        case 'firefox':
            await driver.get(firefoxExtVersionLocation);
            // 'wait' until system info loads then read element
            polkadotJSExtensionVersion = await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/main/article/section[2]/div/ul/li[2]/section/dl/div[2]/dd'))).getText();
            
            break;
        case 'brave':
            // TODO
            break;
        default:
            console.log("BROWSER NOT SUPPORTED! \n");
            break;
    }

    return polkadotJSExtensionVersion;
}

// opening the Dolphin app for the first time, polkadot js will prompt to authorise dolphin webapp
async function authPromptPolkadotExt(driver, extVersion, browser) {
    // Open dolphin app to trigger first use authorization prompt from polkadot js extension
    await driver.get('http://localhost:8000/');
    // wait to make sure everything is loaded
    await new Promise(r => setTimeout(r, 2000));
    // Access auth prompt
    switch (browser) {
        case 'chrome':
            await driver.get(`${chromeExtHTMLPrefix}${extVersion}/index.html#/`);
            break;
        case 'firefox':
            await driver.get(`${firefoxExtHTMLPrefix}${extVersion}/index.html#/`);
            break;
        case 'brave':
            // TODO
            break;
        default:
            console.log("BROWSER NOT SUPPORTED! \n");
            break;
    }
    // click [Yes, allow this application access]
    await driver.wait(until.elementLocated(By.xpath('//button[@class="Button-sc-1gyneog-0 eZHvKI acceptButton"]'))).click();
}   

async function installPolkadotJSExt(driver, browser) {
    // NOTE: The await spam is for the clicks or sendKeys, as sometimes we may click something before it has loaded
    // get extension version from chrome system as we are bulding the extension ourself
    // which would mean the extension UUID will be unique every time.
    let extVersion = await getExtensionVersion(driver,'polkadot', browser);

    switch (browser){
        case 'chrome':
            await driver.get(`${chromeExtHTMLPrefix}${extVersion}/index.html#/`);
            break;
        case 'firefox':
            await driver.get(`${firefoxExtHTMLPrefix}${extVersion}/index.html#/`);
            break;
        case 'brave':
            break;
        default:
            break;
    }

    // continue button
    await driver.wait(until.elementLocated(By.className('Button-sc-1gyneog-0 eZHvKI'))).click();

    // Menu + Toggle button
    await driver.wait(until.elementLocated(By.className('popupToggle'))).click();

    // Choose 'Import account from pre-existing seed' from the menu
    await driver.wait(until.elementLocated(By.xpath('//a[@href="#/account/import-seed"]'))).click();
    
    // Populate seed text input for Alice
    await driver.wait(until.elementLocated(By.className('TextInputs__TextArea-sc-199o3xu-0 jovrJE')))
        .sendKeys("bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice");

    // Next
    await driver.wait(until.elementLocated(By.className('Button-sc-1gyneog-0 eZHvKI NextStepButton-sc-26dpu8-0 jyABgM'))).click();

    // Populate Name text field
    await driver.wait(until.elementLocated(By.xpath('//input[@class="TextInputs__Input-sc-199o3xu-1 hWmYGx" and @type="text"]'))).sendKeys("Alice");

    // Populate password text field need to look for type too as it has the same class as name field
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/main/div[4]/div/input'))).sendKeys("selenium");

    // Populate confirm password text field
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/main/div[5]/div/input'))).sendKeys("selenium");
    
    // Add account button
    await driver.wait(until.elementLocated(By.xpath('//button[@class="Button-sc-1gyneog-0 eZHvKI NextStepButton-sc-26dpu8-0 jyABgM"]'))).click();

    await authPromptPolkadotExt(driver, extVersion, browser);
}

// open network menu and change network
async function goToDolphin(driver) {
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/div[1]/div/div[1]'))).click();
    await driver.wait(until.elementLocated(By.xpath('//html/body/div/div/div/div[1]/div[1]/div/div[2]/a[2]/div'))).click();
    await new Promise(r => setTimeout(r, 2000));
}

// open network menu and change network
async function goToCalamari(driver) {
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[1]/div/div'))).click();
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[1]/div/div[1]/div/div[2]/a[1]/div'))).click();
    await new Promise(r => setTimeout(r, 2000));
}

// try to break send page UI
async function goToCalamari(driver) {
    // Testing Public Private buttons
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/section/div/div/div[1]/div[1]/div[1]/span'))).click();
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/section/div/div/div[1]/div[1]/div[1]/span'))).click();
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/section/div/div/div[2]/div[1]/div[1]/span'))).click();
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/section/div/div/div[2]/div[1]/div[1]/span'))).click();

    // change to DOL to test the currency menu
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/section/div/div/div[1]/div[2]/div[1]'))).click();
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div[1]/section/div/div/div[1]/div[2]/div[1]/div[2]/div/div[7]'))).click();
    
}

module.exports = {installPolkadotJSExt, getExtensionVersion, goToDolphin, goToCalamari};