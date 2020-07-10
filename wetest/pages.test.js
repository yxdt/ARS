const automator = require("miniprogram-automator");
const regeneratorRuntime = require("regenerator-runtime");
const { pageScrollTo } = require("@tarojs/taro");
//const { getApp } = require("@tarojs/taro");
let mPrg;
let page;

beforeAll(async () => {
  jest.setTimeout(800000);
  mPrg = await automator.launch({
    //below is for windows
    //you should comment it when running in Mac
    cliPath: "F:\\Devtools\\wxTools\\wdt\\cli.bat",
    projectPath: "F:\\work2020\\Shipping\\ARS\\dist",

    //below is for Mac OS X
    //projectPath: '/Users/terry/desktop/works2020/ars/dist/',
    //wsEndpoint: 'ws://localhost:9420',
    //projectPath: '\\Users\\terry\\Desktop\\works2020\\ARS\\dist',
  });
  // 直接更改全局变量
  //await mPrg.evaluate(() => {
  //  console.log("getApp():", getApp());
  //  getApp().globalData.waybillNum = "9999";
  //});
}, 35000);
afterAll(async () => {
  await page.waitFor(1000);
  await mPrg.close();
});

describe("pages snapshot test", () => {
  //Index 快照测试，确定界面不会发生变化
  it("index page should load properly", async () => {
    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(100);
    const element = await page.$("page");
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //Camera 页面快照测试
  it("Camera page should load properly", async () => {
    page = await mPrg.redirectTo("/pages/camera/camera");
    await page.waitFor(100);
    const element = await page.$("page");
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //userinfo 页面快照测试
  it("userinfo page should load properly", async () => {
    page = await mPrg.navigateTo("/pages/user/userinfo");
    await page.waitFor(100);
    const element = await page.$("page");
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //Waybill 页面快照测试，确定界面不会发生变化
  it("Waybill detail page should load properly", async () => {
    //只能测试加载已经标记到达的页面，否则到达日期回造成页面快照发送变化导致测试不通过
    page = await mPrg.navigateTo("/pages/sheet/index?wbno=1");
    //page = await mPrg.navigateTo("/pages/sheet/index");
    await page.waitFor(1000);
    const element = await page.$("page");
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //Waybill query 页面快照测试，确定界面不会发生变化
  it("Waybill query list page should load properly", async () => {
    page = await mPrg.navigateTo("/pages/sheet/query");
    await page.waitFor(500);
    const element = await page.$("page");
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });

  //camera verify 页面快照测试，确定界面不会发生变化
  it("camera verify list page should load properly", async () => {
    page = await mPrg.navigateTo("/pages/camera/verify");
    await page.waitFor(500);
    const element = await page.$("page");
    const pagewxml = await element.wxml();
    expect(pagewxml).toMatchSnapshot();
  });
});

describe("Index page test", () => {
  //index page 元素测试
  it("index page should have elements", async () => {
    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(500);
    const wbInput = await page.$(".home-input input");
    const wbInputClass = await wbInput.attribute("class");
    expect(await wbInputClass).toContain("at-input__input ");

    const btn = await page.$(".home-button div");
    const btnText = await btn.text();
    expect(await btnText).toBe("获取交货单信息");

    const btnIcon = await page.$(".home-button div at-icon text");
    const btnIconClass = await btnIcon.attribute("class");
    expect(await btnIconClass).toContain("fa fa-search");
  });

  //首页-业务逻辑功能测试：运单号必须正确输入
  it("should display error prompt", async () => {
    jest.setTimeout(100000);
    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(200);

    //运单号为空,则跳转到错误提示页面
    const wbInput = await page.$(".at-input__input");
    await wbInput.input("");

    const btn = await page.$(".home-button div");
    await btn.tap();
    await page.waitFor(500);

    page = await mPrg.currentPage();
    const retBtn = await page.$(".at-button__wxbutton");
    console.log("retBtn:", retBtn);
    const retBtnCap = await page.$(".at-button__text");

    const retBtnText = await retBtnCap.text();
    console.log("new ret button caption:", retBtnText);
    expect(retBtnText).toBe("返回");
    retBtn.tap();
    await page.waitFor(100);

    //运单号输入后，跳转到详情页面
    page = await mPrg.currentPage();
    const wbInput1 = await page.$(".at-input__input");
    await wbInput1.input("1");

    const btn1 = await page.$(".home-button div");
    expect(btn).toBe(btn1);
    btn1.tap();
    await page.waitFor(200);

    page = await mPrg.currentPage();
    console.log("the page after wbno input:", page);

    //应为运单详情页
    const page1 = await mPrg.redirectTo("/pages/sheet/index?wbno=1");
    await page1.waitFor(200);
    expect(page.path).toBe(page1.path);
    expect(page.query.wbno).toBe(page1.query.wbno);
  });
});

describe("receipt photo page test", () => {
  //如果没有选定运单号，点击回执上传会提示错误
  it("should display error prompt", async () => {
    jest.setTimeout(100000);
    //设运单号为空
    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(200);
    const wbInput = await page.$(".at-input__input");
    await wbInput.input("");
    const btn = await page.$(".home-button div");
    await btn.tap();
    await page.waitFor(500);

    page = await mPrg.redirectTo("/pages/camera/camera");
    await page.waitFor(500);
    const texts = await page.$$("text");
    //console.log("camera.texts:", texts);
    expect(texts.length).toBe(3);
    const text0 = await texts[0].text();
    const text1 = await texts[1].text();
    const text2 = await texts[2].text();
    console.log("text 0,1,2:", text0, text1, text2);
    expect(text0).toBe("请先确认运单");
    expect(text1).toBe(
      "您还没有输入运单信息，不能上传回执扫描，请先扫描运单二维码或手工输入运单号。"
    );
    expect(text2).toBe("点击“返回”按钮继续。");
    const retBtn = await page.$(".at-button");
    await retBtn.tap();
    await page.waitFor(500);

    wbInput.input("1");
    await btn.tap();
    await page.waitFor(500);

    page = await mPrg.redirectTo("/pages/camera/camera");
    await page.waitFor(500);
    const camBtn = await page.$("at-fab");
    const camIcon = await camBtn.$("text");
    const camClass = await camIcon.attribute("class");
    console.log("camBtn, camIcon:", camBtn, camIcon, camClass);
    expect(camIcon.class).not.toBeNull();
    expect(camBtn).not.toBeNull();
    expect(camClass).toBe("at-fab__icon at-icon at-icon-camera");
    const navTitle = await page.$(".at-nav-bar__title");
    const titleText = await navTitle.text();
    expect(titleText).toBe("当前运单：1");
  });
});

describe("userinfo page test", () => {
  //确定处于非登录状态
  it("should not logged in", async () => {
    jest.setTimeout(100000);

    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(200);
    let title = await page.$(".at-nav-bar__title");
    let loginIcon = await page.$(".at-nav-bar__container text");
    let titleText = await title.text();
    let iconClass = await loginIcon.attribute("class");
    if (titleText !== "配送中心人员登录") {
      //如果已登录则退出登录状态
      loginIcon.tap();
      await page.waitFor(300);
      title = await page.$(".at-nav-bar__title");
      loginIcon = await page.$(".at-nav-bar__container text");
      titleText = await title.text();
      iconClass = await loginIcon.attribute("class");
    }
    expect(titleText).toBe("配送中心人员登录");
    expect(iconClass).toContain("fa-id-badge");
  });
  it("should not have center permissions", async () => {
    page = await mPrg.redirectTo("/pages/user/userinfo");
    await page.waitFor(500);
    const verifyIcon = await page.$(".fa-wpforms");
    const queryIcon = await page.$(".fa-pencil-square-o");
    console.log("vIcon, qIcon:", verifyIcon, queryIcon);

    const vIconStyle = await verifyIcon.attribute("style");
    const qIconStyle = await queryIcon.attribute("style");
    console.log("vIconStyle, qIconStyle:", vIconStyle, qIconStyle);
    expect(vIconStyle).toBe(qIconStyle);
  });
  //登录到系统
  it("should have the center permissions", async () => {
    const loginView = await page.$(".at-nav-bar__right-view");
    const loginBtn = await loginView.$("view view");

    const loginIcon = await page.$(".fa-id-badge");
    console.log("loginBtn:", loginBtn, loginIcon);
    loginBtn.tap();
    await page.waitFor(500);

    //确认已到登录页面
    page = await mPrg.currentPage();
    await page.waitFor(500);
    const frmView = await page.$(".user-reg-span");
    console.log("form View :", frmView);

    const frmCap = await page.$(".form-caption");
    const frmCapText = await frmCap.text();
    console.log("caption text:", frmCapText);
    expect(frmCapText).toBe("欢迎登录到");
  });
});
