const Taro = require("@tarojs/taro");
const { getWaybill, confirmWaybill, userLogin } = require("../rest.ts");

describe("User Login API test", () => {
  test("user login successful", () => {
    expect.assertions(1);
    return userLogin("1390000", "password").then((res) => {
      //console.log("res:", res);
      expect(res).toStrictEqual({
        result: true,
        userName: "何燕员",
        roleName: "中心核验员",
      });
    });
  });
  test("user login fail", () => {
    expect.assertions(3);
    return userLogin("anynumber", "anypassword").then((res) => {
      expect(res.result).toBe(false);
      expect(res.userName).toBe("");
      expect(res.roleName).toBe("");
    });
  });
  test("user login cellphone required", () => {
    expect.assertions(1);
    return userLogin("", "password").then((res) => {
      expect(res.result).toBe(false);
    });
  });
  test("user login password required", () => {
    expect.assertions(1);
    return userLogin("1390000", "").then((res) => {
      expect(res.result).toBe(false);
    });
  });
});

describe("Waybill Query", () => {
  it("should get a driver confirmed waybill", () => {
    expect.assertions(4);
    return getWaybill("1").then((res) => {
      //console.log("test.getWaybill.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data.ordNo).toBe("1");
      expect(res.data.status).toBe(1);
      expect(res.data.ordDetailList.length).toBe(8);
    });
  });
  it("should get a center confirmed waybill", () => {
    expect.assertions(6);
    return getWaybill("2").then((res) => {
      //console.log("test.getWaybill.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data.ordNo).toBe("2");
      expect(res.data.status).toBe(8);
      expect(res.data.ordDetailList.length).toBe(8);
      expect(res.data.ordDetailList[7].id).toBe(27);
      expect(res.data.ordDetailList[7].ordNo).toBe("2");
    });
  });
  it("should get a not arrived waybill", () => {
    expect.assertions(4);
    return getWaybill("3").then((res) => {
      //console.log("test.getWaybill.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data.ordNo).toBe("3");
      expect(res.data.status).toBe(0);
      expect(res.data.ordDetailList.length).toBe(8);
    });
  });
  it("should get no waybill", () => {
    expect.assertions(2);
    return getWaybill("000").then((res) => {
      //console.log("test.getWaybill.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toBeNull();
    });
  });
});

describe("confirm Waybill test", () => {
  const wbInfo = {
    openid: "test_openid",
    sysTime: new Date(),
    ordNo: "123",
    shpToCd: "0101",
    latitude: 123,
    longitude: 456,
    address: "司机的测试地址",
    phone: "13901390139",
  };
  it("should confirm the waybill by driver", () => {
    expect.assertions(3);
    return confirmWaybill(wbInfo).then((res) => {
      //console.log("test.confirmWaybill.res:", res, typeof res.responseTime);
      //console.log(res.responseTime, new Date(res.responseTime));
      expect(res.code).toBe("0000");
      expect(res.data).toBeNull();
      expect(new Date(res.responseTime).valueOf()).toBeLessThanOrEqual(
        new Date().valueOf()
      );
    });
  });
});

describe("picture upload test", () => {});
