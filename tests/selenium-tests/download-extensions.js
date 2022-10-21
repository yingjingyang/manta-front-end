const  spawn = require('child_process').spawn;
const { By, Builder, until } = require('selenium-webdriver');
require('selenium-webdriver/testing');
require('selenium-webdriver/firefox');

// Download extensions before we get to the main tests, as different browsers
// require different methods of download

// For chrome we can use the latest from Github Polkadot JS extension

// For firefox we need to use the one in the store as the Github one does not have a UUID
// and firefox is not happy and there is no workaround unfortunetelly 

describe('Download Firefox Extension', function() {
    this.timeout(10000);
    let firefoxDriver;
    
    before(async function() {  
        firefoxDriver = await new Builder()
        .forBrowser('firefox')
        .build();
    });

    it('Download Firefox Extension', async function() {
        await firefoxDriver.get('https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/');
        let downloadLink = await firefoxDriver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/div/div[2]/div[1]/section[1]/div/header/div[4]/div/div/a'))).getAttribute('href');
        
        let child = await spawn(`curl ${downloadLink} --output extension.xpi`, { shell: true });
        child.stderr.on('data', function (data) {
            console.error("STDERR:", data.toString());
        });
        child.on('exit', function (exitCode) {
            console.log("Child exited with code: " + exitCode);
        });
    });

    after(() => {
        firefoxDriver.quit();
    });

});

describe('Download Chrome Extension', function() {
    this.timeout(10000);

    it('Download Chrome Github Extension and Build it', async function() {

        // NOTE: for now we want to install the extension outside of yarn projects as that is breaking the extension building
        // Moreso the extension dependency installing
    });
});