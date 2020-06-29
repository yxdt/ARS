const Taro = require("@tarojs/taro");
const { userLogin } = require("../rest.ts");

describe("User Login API test", () => {
  test("user login successful", () => {
    expect.assertions(1);
    return userLogin("1390000", "password").then((res) => {
      console.log("res:", res);
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
