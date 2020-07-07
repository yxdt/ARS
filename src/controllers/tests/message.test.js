const {
  sendArriveMessage,
  sendUploadMessage,
  sendRejectMessage,
} = require("../rest.ts");

describe("System Message Sending test: Driver Arrive Message", () => {
  it("should driver Send Arrived message successful", () => {
    expect.assertions(2);
    return sendArriveMessage("1", "alsdfjasifwek").then((res) => {
      //console.log("message.test.sendArriveMessage.success.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toStrictEqual({
        errcode: "0",
        errmsg: "ok",
      });
    });
  });
  it("should CDC clerk refuse the message.", () => {
    expect.assertions(2);
    return sendArriveMessage("000", "askdasdfasdf").then((res) => {
      //console.log("message.test.sendArriveMessage.refuse.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toStrictEqual({
        errcode: "43101",
        errmsg: "user refuse to accept the msg",
      });
    });
  });
  it("should get a fail response.", () => {
    expect.assertions(2);
    return sendArriveMessage("999", "askdasdfasdf").catch((res) => {
      //console.log("message.test.sendArriveMessage.fail.res:", res);
      expect(res.code).toBe("0400");
      expect(res.data).toBeNull();
    });
  });
});

describe("System Message Sending test: Driver Upload Notifacation Message", () => {
  it("should driver Send photo upload message successful", () => {
    expect.assertions(2);
    return sendUploadMessage("1", "alsdfjasifwek").then((res) => {
      //console.log("message.test.sendUploadMessage.success.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toStrictEqual({
        errcode: "0",
        errmsg: "ok",
      });
    });
  });
  it("should CDC clerk refuse the message.", () => {
    expect.assertions(2);
    return sendUploadMessage("000", "askdasdfasdf").then((res) => {
      //console.log("message.test.sendUploadMessage.refuse.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toStrictEqual({
        errcode: "43101",
        errmsg: "user refuse to accept the msg",
      });
    });
  });
  it("should get a fail response.", () => {
    expect.assertions(2);
    return sendUploadMessage("999", "askdasdfasdf").catch((res) => {
      //console.log("message.test.sendUploadMessage.fail.res:", res);
      expect(res.code).toBe("0400");
      expect(res.data).toBeNull();
    });
  });
});

describe("System Message Sending test: CDC Reject Notifacation Message", () => {
  it("should CDC Send photo reject message successful", () => {
    expect.assertions(2);
    return sendRejectMessage("1", "alsdfjasifwek").then((res) => {
      //console.log("message.test.sendRejectMessage.success.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toStrictEqual({
        errcode: "0",
        errmsg: "ok",
      });
    });
  });
  it("should driver refuse the message.", () => {
    expect.assertions(2);
    return sendRejectMessage("000", "askdasdfasdf").then((res) => {
      //console.log("message.test.sendRejectMessage.refuse.res:", res);
      expect(res.code).toBe("0000");
      expect(res.data).toStrictEqual({
        errcode: "43101",
        errmsg: "user refuse to accept the msg",
      });
    });
  });
  it("should get a fail response.", () => {
    expect.assertions(2);
    return sendRejectMessage("999", "askdasdfasdf").catch((res) => {
      //console.log("message.test.sendRejectMessage.fail.res:", res);
      expect(res.code).toBe("0400");
      expect(res.data).toBeNull();
    });
  });
});
