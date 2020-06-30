const automator = require("miniprogram-automator");

automator
  .launch({
    cliPath: "F:/Devtools/wxTools/wdt/cli",
    //cliPath: "F:\\Devtools\\wxTools\\微信web开发者工具\\cli",
    projectPath: "dist",
  })
  .then(async (weapp) => {
    const page = await weapp.reLaunch("pages/index/index");
    await page.waitFor(500);
    const element = await page.$(".home-title-span");
    console.log(await element.attribute("class"));
    await element.tap();
    await weapp.close();
  });
