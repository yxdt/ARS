const {
  sendArriveMessage,
  sendUploadMessage,
  sendRejectMessage,
} = require("../rest.ts");
const { queryMessages, markRead, markHide } = require("../message");

describe("System Message Sending test: Driver Arrive Message", () => {
  it("should driver Send Arrived message successful", () => {
    expect.assertions(2);
    return sendArriveMessage("1", "alsdfjasifwek").then((res) => {
      ////consolelog("message.test.sendArriveMessage.success.res:", res);
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
      ////consolelog("message.test.sendArriveMessage.refuse.res:", res);
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
      ////consolelog("message.test.sendArriveMessage.fail.res:", res);
      expect(res.code).toBe("0400");
      expect(res.data).toBeNull();
    });
  });
});

describe("System Message Sending test: Driver Upload Notifacation Message", () => {
  it("should driver Send photo upload message successful", () => {
    expect.assertions(2);
    return sendUploadMessage("1", "alsdfjasifwek").then((res) => {
      ////consolelog("message.test.sendUploadMessage.success.res:", res);
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
      ////consolelog("message.test.sendUploadMessage.refuse.res:", res);
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
      ////consolelog("message.test.sendUploadMessage.fail.res:", res);
      expect(res.code).toBe("0400");
      expect(res.data).toBeNull();
    });
  });
});

describe("System Message Sending test: CDC Reject Notifacation Message", () => {
  it("should CDC Send photo reject message successful", () => {
    expect.assertions(2);
    return sendRejectMessage("1", "alsdfjasifwek").then((res) => {
      ////consolelog("message.test.sendRejectMessage.success.res:", res);
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
      ////consolelog("message.test.sendRejectMessage.refuse.res:", res);
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
      ////consolelog("message.test.sendRejectMessage.fail.res:", res);
      expect(res.code).toBe("0400");
      expect(res.data).toBeNull();
    });
  });
});

describe("Query System Messages", () => {
  const query = {
    beginDate: new Date(new Date().valueOf - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    toOpenid: "203939392safasdf",
    ordNo: "1",
    cdcCode: "0101",
    status: 0,
  };

  it("should query messages successful", () => {
    expect.assertions(2);
    return queryMessages(query).then((res) => {
      ////consolelog('message.test.queryMessges.success.res:', res);
      expect(res.result).toBe("success");
      expect(res.messages.length).toBe(res.count);
    });
  });
  it("should query message fail", () => {
    expect.assertions(3);
    query.ordNo = "000";
    return queryMessages(query).then((res) => {
      ////consolelog('message.test.queryMessages.fail.res:', res);

      expect(res.result).toBe("fail");
      expect(res.messages).toBeNull();
      expect(res.count).toBe(0);
    });
  });
  it("should mark message as read error", () => {
    query.ordNo = "999";
    expect.assertions(3);
    return queryMessages(query).catch((res) => {
      ////consolelog('message.test.markRead.error.res:', res);
      expect(res.result).toBe("error");
      expect(res.messages).toBeNull();
      expect(res.count).toBe(0);
    });
  });
});

describe("Mark System Messages as read", () => {
  it("should mark message as read successful", () => {
    expect.assertions(1);
    return markRead(123).then((res) => {
      ////consolelog('message.test.markRead.success.res:', res);
      expect(res.result).toBe("success");
    });
  });
  it("should mark message as read fail", () => {
    expect.assertions(1);
    return markRead(0).then((res) => {
      ////consolelog('message.test.markRead.fail.res:', res);
      expect(res.result).toBe("fail");
    });
  });
  it("should mark message as read error", () => {
    expect.assertions(1);
    return markRead(999).catch((res) => {
      ////consolelog('message.test.markRead.error.res:', res);
      expect(res.result).toBe("error");
    });
  });
});

describe("Mark System Messages as hide", () => {
  it("should query messages successful", () => {
    expect.assertions(1);
    return markHide(123).then((res) => {
      ////consolelog('message.test.markHide.success.res:', res);
      expect(res.result).toBe("success");
    });
  });
  it("should mark message as hide fail", () => {
    expect.assertions(1);
    return markHide(0).then((res) => {
      ////consolelog('message.test.markHide.fail.res:', res);
      expect(res.result).toBe("fail");
    });
  });
  it("should mark message as hide error", () => {
    expect.assertions(1);
    return markHide(999).catch((res) => {
      ////consolelog('message.test.markHide.error.res:', res);
      expect(res.result).toBe("error");
    });
  });
});
