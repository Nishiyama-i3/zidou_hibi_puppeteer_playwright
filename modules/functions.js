module.exports = {
  loginCyber: async (page, cyberID, cyberPass) => {
    await page.click('input[name="DataSource"]');
    await page.keyboard.type('i3-systems');
    await page.keyboard.press('Tab');
    await page.keyboard.type(cyberID);
    await page.keyboard.press('Tab');
    await page.keyboard.type(cyberPass);
    await page.keyboard.press('Tab');

    await Promise.all([
      page.waitForNavigation(),
      page.keyboard.press('Space'),
    ]);
  },
  getCyberTime: async(page) => {
    await page.waitForTimeout(1000);

    let frame1 = await page.frames().find((f) => f.name() == 'FRAME1');
    let frame2 = await page.frames().find((f) => f.name() == 'FRAME2');

    await frame1.waitForSelector('#menu01');

    await frame1.click('#menu01');

    await frame2.waitForSelector('#menu01_03');
    await frame2.click('#menu01_03');
    let date = new Date();
    let today = date.getFullYear().toString() + ("0" + (date.getMonth() + 1).toString()).slice(-2) + ("0" + date.getDate().toString()).slice(-2)
    frame2 = await page.frames().find((f) => f.name() == 'FRAME2');
    let iframe0 = frame2.childFrames().find((f) => f.name() == 'frames0');
    await frame2.waitForTimeout(5000)
    //  iframe0.waitForSelector('input[name="StartYMD"]');
    //↑これだとinputが見つけられなかったのでなし
    await iframe0.click('input[name="StartYMD"]');
    await page.keyboard.type(today);
    await page.keyboard.press('Tab');
    await page.keyboard.type(today);
    await iframe0.click('input[value="検索"]');
    await iframe0.waitForSelector('#grdXyw1100G-rc-0-7 > nobr');
    let sTime = await iframe0.$eval('#grdXyw1100G-rc-0-7 > nobr', item => {
      return item.textContent
    });
    let eTime = await iframe0.$eval('#grdXyw1100G-rc-0-10 > nobr', item => {
      return item.textContent
    });
    return [sTime, eTime]
  },
  hibi: async(firefox, startTime, endTime, hibiID, hibiPass) => {
    const browser = await firefox.launch({headless: false});
    const context = await browser.newContext({
      ignoreHTTPSErrors: true
    });
    page = await context.newPage();
    await page.goto('https://hibi.i3-systems.com/user/login');
    await page.fill('#UserUserName', hibiID);
    await page.fill('#UserPassword', hibiPass);
    await page.click('text=ログイン');
    let dateString = '2021 01 01\\s'
    let workHours = (Date.parse(dateString + endTime) - Date.parse(dateString + startTime)) / 1000 / 60 / 60;
    await page.fill('[name="start_time"]', startTime);
    await page.fill('[name="end_time"]', endTime);
    if (workHours >= 4) {
      await page.fill('[name="break_time"]', '01:00');
    } else {
      await page.fill('[name="break_time"]', '00:00');
    }
    await page.click('text=一時保存');

    browser.close();
  }
}