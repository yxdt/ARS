const { doLogin } = require("../users.ts");

describe("User Login Test", () => {
  it("should login successfully", () => {
    expect.assertions(3);
    return doLogin("1390000", "password").then((res) => {
      console.log("test.doLogin.res:", res);
      expect(res.result).toBe(true);
      expect(res.userName).toBe("何燕员");
      expect(res.roleName).toBe("中心核验员");
    });
  });
});
