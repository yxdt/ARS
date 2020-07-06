const { doLogin, getDriverInfo } = require("../users.ts");

describe("User Login Test", () => {
  it("should login successfully", () => {
    expect.assertions(3);
    return doLogin("1390000", "password").then((res) => {
      //console.log('test.doLogin.res:', res);
      expect(res.result).toBe("success");
      expect(res.user.userName).toBe("何燕员");
      expect(res.user.roleName).toBe("中心核验员");
    });
  });

  it("should login fail", () => {
    expect.assertions(3);
    return doLogin("aadf", "aidid").then((res) => {
      //console.log('test.doLogin.res:', res);
      expect(res.result).toBe("fail");
      expect(res.user.userName).toBe("");
      expect(res.user.roleName).toBe("");
    });
  });

  it("password cannot be empty", () => {
    expect.assertions(3);
    return doLogin("1390000", "").then((res) => {
      expect(res.result).toBe("fail");
      expect(res.user.userName).toBe("");
      expect(res.user.roleName).toBe("");
    });
  });

  it("should reject", () => {
    expect.assertions(3);
    return doLogin("000000", "").catch((res) => {
      expect(res.result).toBe("error");
      expect(res.user.userName).toBe("");
      expect(res.user.roleName).toBe("");
    });
  });
});

describe("Driver Info Test", () => {
  it("should get driver info correctly", () => {
    expect.assertions(5);
    return getDriverInfo("1390000").then((res) => {
      //console.log("test.user.getDriverInfo.res:", res);
      expect(res.phone).toBe("1390000");
      expect(res.openid).toBe("123abcdefg9887");
      expect(res.latitude).toBe("123.45");
      expect(res.longitude).toBe("234.56");
      expect(res.address).toBe("北京市东城区长安街1号");
    });
  });
});
