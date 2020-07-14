const automator = require("miniprogram-automator");
const regeneratorRuntime = require("regenerator-runtime");

//const { getApp } = require("@tarojs/taro");
let mPrg;
let page;

beforeAll(async () => {
  jest.setTimeout(800000);
  ////consolelog("beforeAll:begin:", mPrg);
  // mPrg = await automator.connect({
  //   wsEndpoint: 'ws://localhost:33979',
  // });

  mPrg = await automator.launch({
    //below is for windows
    //you should comment it when running in Mac
    cliPath: "F:\\Devtools\\wxTools\\wdt\\cli.bat",
    projectPath: "F:\\work2020\\Shipping\\ARS\\dist",

    //below is for Mac OS X
    //cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
    //port: 9420,
    //projectPath: '/Users/terry/desktop/works2020/ars/dist',
    //wsEndpoint: 'ws://localhost:9420',
    //projectPath: '\\Users\\terry\\Desktop\\works2020\\ARS\\dist',
  });
  ////consolelog("miniprogram:", mPrg);
}, 35000);
afterAll(async () => {
  //consolelog("!!!All Test Passed!!!");
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
    ////consolelog("retBtn:", retBtn);
    const retBtnCap = await page.$(".at-button__text");

    const retBtnText = await retBtnCap.text();
    ////consolelog("new ret button caption:", retBtnText);
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
    ////consolelog("the page after wbno input:", page);

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
    ////consolelog("camera.texts:", texts);
    expect(texts.length).toBe(3);
    const text0 = await texts[0].text();
    const text1 = await texts[1].text();
    const text2 = await texts[2].text();
    ////consolelog("text 0,1,2:", text0, text1, text2);
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
    ////consolelog("camBtn, camIcon:", camBtn, camIcon, camClass);
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
      await page.waitFor(500);
      page = await mPrg.currentPage();
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
    ////consolelog("vIcon, qIcon:", verifyIcon, queryIcon);

    const vIconStyle = await verifyIcon.attribute("style");
    const qIconStyle = await queryIcon.attribute("style");
    ////consolelog("vIconStyle, qIconStyle:", vIconStyle, qIconStyle);
    expect(vIconStyle).toBe(qIconStyle);

    verifyIcon.tap();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/user/userinfo");

    queryIcon.tap();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/user/userinfo");
  });
  //登录到系统
  it("should have the center permissions", async () => {
    const loginView = await page.$(".at-nav-bar__right-view");
    //const loginBtn = await loginView.$("view view");
    let loginBtn = await page.$(".at-nav-bar__container text");

    const loginIcon = await page.$(".fa-id-badge");
    expect(loginBtn).not.toBeNull();
    expect(loginIcon).not.toBeNull();

    //确认已到登录页面
    page = await mPrg.redirectTo("/pages/user/Login");
    await page.waitFor(500);
    const frmView = await page.$(".user-reg-span");
    ////consolelog("form View :", frmView);

    const frmCap = await page.$(".form-caption");
    const frmCapText = await frmCap.text();
    ////consolelog("caption text:", frmCapText);
    expect(frmCapText).toContain("欢迎登录到");
    expect(frmCapText).toContain("TIMS");
    expect(frmCapText).toContain("配送信息管理系统");

    //输入登录信息
    const inputs = await page.$$("input");
    expect(inputs.length).toBe(2);
    inputs[0].input("1390000");
    inputs[1].input("password");
    const btns = await page.$$("button");
    expect(btns.length).toBe(2);
    btns[0].tap();
    await page.waitFor(500);

    //此时已成功登录
    page = await mPrg.redirectTo("/pages/user/userinfo"); //登录成功后的userinfo页面
    await page.waitFor(500);
    let title = await page.$(".at-nav-bar__title");
    let loginIcon1 = await page.$(".at-nav-bar__container text");
    let titleText = await title.text();
    let iconClass = await loginIcon1.attribute("class");

    expect(titleText).toBe("点击退出");
    expect(iconClass).toContain("fa-sign-out");

    //登录成功后，有相应权限
    const verifyIcon = await page.$(".fa-wpforms");
    const queryIcon = await page.$(".fa-pencil-square-o");
    ////consolelog("vIcon, qIcon:", verifyIcon, queryIcon);

    const vIconStyle = await verifyIcon.attribute("style");
    const qIconStyle = await queryIcon.attribute("style");
    ////consolelog("vIconStyle, qIconStyle:", vIconStyle, qIconStyle);
    expect(vIconStyle).toBe("color:#ce007c;font-size:40px;");
    expect(qIconStyle).toBe("color:#d15805;font-size:40px;");

    //确认拥有回执核验权限
    verifyIcon.tap();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/camera/verify");

    await mPrg.navigateBack();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/user/userinfo");

    //确认拥有运单查询权限
    queryIcon.tap();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/sheet/query");
    await mPrg.navigateBack();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/user/userinfo");

    //点击退出
    //page = await mPrg.redirectTo("/pages/user/userinfo"); //登录成功后的userinfo页面
    loginBtn = await page.$(".at-nav-bar__container text");
    loginBtn.tap();
    await page.waitFor(500);
    //page.callMethod("anonymousFunc0"); //("onClickRgIconSt");

    //退出登录后应该转到首页
    page = await mPrg.currentPage(); //应该是index页面
    expect(page.path).toBe("pages/index/index");
  });
});

describe("verify uploaded receipts test", () => {
  //确定处于已登录状态
  it("should log in successfully", async () => {
    jest.setTimeout(100000);
    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(200);
    let title = await page.$(".at-nav-bar__title");
    let loginIcon = await page.$(".at-nav-bar__container text");
    let titleText = await title.text();
    let iconClass = await loginIcon.attribute("class");
    if (titleText !== "点击退出") {
      //如果尚未登录，先登录系统
      loginIcon.tap();
      await page.waitFor(500);
      page = await mPrg.currentPage();
      expect(page.path).toBe("pages/user/Login");
      await page.waitFor(500);
      //输入登录信息
      const inputs = await page.$$("input");
      expect(inputs.length).toBe(2);
      inputs[0].input("1390000");
      inputs[1].input("password");
      const btns = await page.$$("button");
      expect(btns.length).toBe(2);
      btns[0].tap();
      await page.waitFor(500);
      //登录成功后，应转到用户信息页面
      page = await mPrg.currentPage();
      expect(page.path).toBe("pages/user/userinfo");

      title = await page.$(".at-nav-bar__title");
      loginIcon = await page.$(".at-nav-bar__container text");
      titleText = await title.text();
      iconClass = await loginIcon.attribute("class");
    }
    expect(titleText).toBe("点击退出");
    expect(iconClass).toContain("fa-sign-out");
  });
  it("should have verify permission and have uploaded list", async () => {
    page = await mPrg.navigateTo("/pages/camera/verify");
    await page.waitFor(500);
    const formTitle = await page.$(".form-title");
    const formTitleText = await formTitle.text();
    expect(formTitleText).toBe("待审核回执列表");

    const listItems = await page.$$("at-list-item");
    expect(listItems.length).toBe(3);

    //跳转一个，应转到详情页面
    const listItemView = await listItems[0].$("view");
    listItemView.tap();
    await page.waitFor(500);

    const btns = await page.$$(".preview-confirm-button");
    expect(btns.length).toBe(2);
    const btnText1 = await btns[0].text();
    const btnText2 = await btns[1].text();
    expect(btnText1).toBe("通过");
    expect(btnText2).toBe("退回");
    btns[0].tap();
    await page.waitFor(500);

    //通过后，列表应该少一个
    //page = await mPrg.currentPage();
    const listItems1 = await page.$$("at-list-item");
    expect(listItems1.length).toBe(2);

    //跳转下一个
    const listItemView1 = await listItems1[0].$("view");
    listItemView1.tap();
    await page.waitFor(500);

    const btns1 = await page.$$(".preview-confirm-button");
    expect(btns1.length).toBe(2);
    btns1[1].tap();
    await page.waitFor(500);

    //应该弹出拒绝理由输入提示框
    const model = await page.$(".at-modal__header");
    const modelTitle = await model.text();
    expect(modelTitle).toBe("退回操作");

    const rejectReason = await page.$(".at-input__input");
    rejectReason.input("测试退回操作");

    //获取按钮,并点击确认退回
    const btnsa2 = await page.$("at-modal-action");
    const btns2 = await btnsa2.$$("button");
    expect(btns2.length).toBe(2);
    const btns20 = await btns2[0].text();
    const btns21 = await btns2[1].text();
    expect(btns20).toBe("取消");
    expect(btns21).toBe("确认退回");
    btns2[1].tap();
    await page.waitFor(500);

    //退回操作后，待确认列表再次减一
    const listItems2 = await page.$$("at-list-item");
    expect(listItems2.length).toBe(1);
  });

  it("should have verify permission and have query function", async () => {
    page = await mPrg.navigateTo("/pages/sheet/query");
    await page.waitFor(500);
    const formTitle = await page.$(".form-title");
    const formTitleText = await formTitle.text();
    expect(formTitleText).toBe("交货单查询");

    const dates = await page.$$("picker");
    expect(dates.length).toBe(2);
    const dates1 = await dates[0].value();
    const dates2 = await dates[1].value();
    ////consolelog("dates1, dates2:", dates1, dates2);
    expect(dates1).toBe(
      new Date(new Date().valueOf() - 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString()
        .replace("-", "/")
    );
    expect(dates2).toBe(new Date().toLocaleDateString().replace("-", "/"));

    let qryBtn = await page.$(".at-button");
    let qryBtnTxtView = await qryBtn.$(".at-button__text");
    let qryBtnTxt = await qryBtnTxtView.text();
    expect(qryBtnTxt).toBe("查询");
    qryBtn.tap();
    await page.waitFor(500);

    //按钮提示变为‘再次查询’
    qryBtn = await page.$(".at-button");
    qryBtnTxtView = await qryBtn.$(".at-button__text");
    qryBtnTxt = await qryBtnTxtView.text();
    expect(qryBtnTxt).toBe("再次查询");

    //结果列出
    let qryResult = await page.$(".user-reg-span");
    let qrTitle = await qryResult.text();
    expect(qrTitle.substr(0, 5)).toBe("查询结果：");

    //应为5条记录
    let results = await qryResult.$$("at-list-item");
    expect(results.length).toBe(5);

    //点击第二条，跳转到发货单1
    const record = await results[1].$(".at-list__item");
    record.tap();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    expect(page.path).toBe("pages/sheet/index");
    let curTitle = await page.$(".form-title");
    let curTitleText = await curTitle.text();
    expect(curTitleText).toBe("交货单详细信息");

    //返回上级，应返回查询页面
    await mPrg.navigateBack();
    await page.waitFor(500);
    page = await mPrg.currentPage();
    curTitle = await page.$(".form-title");
    curTitleText = await curTitle.text();
    expect(curTitleText).toBe("交货单查询");

    //再次点击查询按钮，显示查询条件输入框
    qryBtn = await page.$(".at-button");
    qryBtnTxtView = await qryBtn.$(".at-button__text");
    qryBtnTxt = await qryBtnTxtView.text();
    expect(qryBtnTxt).toBe("再次查询");
    qryBtn.tap();
    await page.waitFor(500);
    //查询结果应隐藏
    qryResult = await page.$(".user-reg-span");
    //results = await qryResult.$$("at-list-item");
    expect(qryResult).toBeNull();
    qryBtnTxt = await qryBtnTxtView.text();
    expect(qryBtnTxt).toBe("查询");
  });

  it("should log out", async () => {
    jest.setTimeout(100000);
    page = await mPrg.redirectTo("/pages/index/index");
    await page.waitFor(200);
    let title = await page.$(".at-nav-bar__title");
    let loginIcon = await page.$(".at-nav-bar__container text");
    let titleText = await title.text();
    let iconClass = await loginIcon.attribute("class");
    if (titleText === "点击退出") {
      //如果尚未登录，先登录系统
      loginIcon.tap();
      await page.waitFor(800);
      page = await mPrg.currentPage();
      title = await page.$(".at-nav-bar__title");
      loginIcon = await page.$(".at-nav-bar__container text");
      titleText = await title.text();
      iconClass = await loginIcon.attribute("class");
    }
    expect(titleText).toBe("配送中心人员登录");
    expect(iconClass).toContain("fa-id-badge");
  });
});
