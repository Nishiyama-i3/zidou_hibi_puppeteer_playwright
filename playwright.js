
const { firefox } = require('playwright');
const puppeteer = require('puppeteer');
const [cyberID, cyberPass, hibiID, hibiPass] = require('./modules/variables');
const functions = require('./modules/functions');

let startTime, endTime;

puppeteer.launch({headless: false, product: 'firefox', executablePath: '/Applications/Firefox Nightly.app/Contents/MacOS/firefox'}).then(async (browser) => {
  let page = await browser.newPage();
  await page.goto('https://cxg5.i-abs.co.jp/cyberx/login.asp');
  await functions.loginCyber(page, cyberID, cyberPass);
  [startTime, endTime] = await functions.getCyberTime(page);
  browser.close();
}).then(async () => {
  await functions.hibi(firefox, startTime, endTime, hibiID, hibiPass);
});
