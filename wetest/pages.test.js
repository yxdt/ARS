const automator = require('miniprogram-automator');
const regeneratorRuntime = require('regenerator-runtime');
//const { getApp } = require("@tarojs/taro");

describe('pages snapshot test', () => {
  let mPrg;
  let page;

  beforeAll(async () => {
    mPrg = await automator.launch({
      //below is for windows
      //you should comment it when running in Mac
      //cliPath: 'F:\\Devtools\\wxTools\\wdt\\cli.bat',
      //projectPath: 'F:\\work2020\\Shipping\\ARS\\dist',

      //below is for Mac OS X
      projectPath: '/Users/terry/desktop/works2020/ars/dist',
      //wsEndpoint: 'ws://localhost:9420',
      //projectPath: '\\Users\\terry\\Desktop\\works2020\\ARS\\dist',
    });
    // 直接更改全局变量
    //await mPrg.evaluate(() => {
    //  console.log("getApp():", getApp());
    //  getApp().globalData.waybillNum = "9999";
    //});

    page = await mPrg.reLaunch('/pages/index/index');
    //console.log("the initial page:", page);
    await page.waitFor(500);
  }, 25000);
  afterAll(async () => {
    await page.waitFor(15000);
    await mPrg.close();
  });

  //Index 快照测试，确定界面不会发生变化
  it('index page should load properly', async () => {
    const element = await page.$('page');
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  it('index page should have elements', async () => {
    const wbInput = await page.$('.home-input input');
    const wbInputClass = await wbInput.attribute('class');
    expect(await wbInputClass).toContain('at-input__input ');

    const btn = await page.$('.home-button div');
    const btnText = await btn.text();
    expect(await btnText).toBe('获取交货单信息');

    const btnIcon = await page.$('.home-button div at-icon text');
    const btnIconClass = await btnIcon.attribute('class');
    expect(await btnIconClass).toContain('fa fa-search');
  });

  //Camera 快照测试
  it('Camera page should load properly', async () => {
    page = await mPrg.redirectTo('/pages/camera/camera');
    await page.waitFor(500);
    const element = await page.$('page');
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //userinfo 快照测试
  it('userinfo page should load properly', async () => {
    page = await mPrg.navigateTo('/pages/user/userinfo');
    await page.waitFor(500);
    const element = await page.$('page');
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //Waybill 快照测试，确定界面不会发生变化
  it('Waybill detail page should load properly', async () => {
    page = await mPrg.navigateTo('/pages/sheet/index?wbno=1111');
    await page.waitFor(500);
    const element = await page.$('page');
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //Waybill query 快照测试，确定界面不会发生变化
  it('Waybill query list page should load properly', async () => {
    page = await mPrg.navigateTo('/pages/sheet/query');
    await page.waitFor(500);
    const element = await page.$('page');
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //camera verify 快照测试，确定界面不会发生变化
  it('camera verify list page should load properly', async () => {
    page = await mPrg.navigateTo('/pages/camera/verify');
    await page.waitFor(500);
    const element = await page.$('page');
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //逻辑功能测试暂缓
  // it("should display error prompt", async () => {
  //   const btn = await page.$(".home-button div");
  //   await btn.tap();
  //   await page.waitFor(1000);
  //   const retBtn = await page.$(".at-button__wxbutton");
  //   console.log("retBtn:", retBtn);
  //   const retBtnCap = await retBtn.$(".at-button__text");

  //   console.log("new ret button caption:", await retBtnCap.text());
  //   expect(await retBtnCap.text()).toBe("返回");
  //   retBtn.tap();
  //   await page.waitFor(1000);
  // });
});

//await element.input("1234");

//await btn.tap();
//await page.waitFor(15000);
//await weapp.close();
