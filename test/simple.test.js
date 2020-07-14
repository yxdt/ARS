const { doLogin, getDriverInfo } = require("../src/controllers/users.ts");

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
});

describe("Simple Test", () => {
  it("should get calculation result correctly", () => {
    expect(1 + 1).toBe(2);
  });
});
