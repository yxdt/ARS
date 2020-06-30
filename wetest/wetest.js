const automator = require('miniprogram-automator');

automator
  .launch({
    //cliPath: "F:/Devtools/wxTools/wdt/cli",
    //cliPath: "F:\\Devtools\\wxTools\\微信web开发者工具\\cli",
    projectPath: '/Users/terry/desktop/works2020/ars/dist',
    //wsEndpoint: 'ws://localhost:52364'
  })
  .then(async (weapp) => {
    console.log('open a automatic test...');
    const page = await weapp.reLaunch('/pages/index/index');
    await page.waitFor(500);
    const element = await page.$('.home-input input');
    console.log(await element.attribute('class'));
    //await element.tap();
    await element.trigger('input', { vsalue: '1' });
    //console.log(await element);
    await page.waitFor(500);
    const btn = await page.$('.home-button');
    console.log(await btn.attribute('inner_text'));
    await btn.tap();
    await page.waitFor(1500);
    await weapp.close();
  });
