const { loadWaybill } = require("../waybill.ts");
const { confirmArrive, queryWaybills } = require("../waybill");

describe("Load Waybill Test", () => {
  it("should load an arrived waybill successfully", () => {
    expect.assertions(5);
    return loadWaybill("1").then((res) => {
      //console.log("test.loadWaybill.res:", res);
      expect(res.result).toBe("success");
      expect(res.waybill.wbNum).toBe("1");
      expect(res.waybill.status).toBe("arrived");
      expect(res.waybill.photos.length).toBe(2);
      expect(res.waybill.shipItems.length).toBe(8);
    });
  });
  it("should load an confirmed waybill successfully", () => {
    expect.assertions(3);
    return loadWaybill("2").then((res) => {
      //console.log("test.loadWaybill.res:", res);
      expect(res.result).toBe("success");
      expect(res.waybill.wbNum).toBe("2");
      expect(res.waybill.status).toBe("confirmed");
    });
  });
  it("should load an loaded waybill successfully", () => {
    expect.assertions(4);
    return loadWaybill("3342").then((res) => {
      //console.log("test.loadWaybill3342.res:", res);
      expect(res.result).toBe("success");
      expect(res.waybill.wbNum).toBe("3342");
      expect(res.waybill.status).toBe("loaded");
      expect(res.waybill.photos.length).toBe(0);
    });
  });
  it("should load an loaded waybill but no photos successfully", () => {
    expect.assertions(4);
    return loadWaybill("9999").then((res) => {
      //console.log("test.loadWaybill9999.res:", res);
      expect(res.result).toBe("success");
      expect(res.waybill.wbNum).toBe("9999");
      expect(res.waybill.status).toBe("loaded");
      expect(res.waybill.photos.length).toBe(0);
    });
  });
  it("should not find a waybill", () => {
    expect.assertions(2);
    return loadWaybill("000").catch((res) => {
      //console.log("test.loadWaybill.000.res:", res);
      expect(res.result).toBe("fail");
      expect(res.waybill).toBeNull();
    });
  });
  it("should reject an error ", () => {
    expect.assertions(2);
    return loadWaybill("999").catch((res) => {
      //console.log("test.loadWaybill.999.reject.res:", res);
      expect(res.result).toBe("fail");
      expect(res.waybill).toBeNull();
    });
  });
});

describe("Confirm Waybill Test", () => {
  it("should confirm", () => {
    expect.assertions(1);
    return confirmArrive("1234", "", "1390000", new Date()).then((res) => {
      expect(res.result).toBe("success");
    });
  });
  it("should return fail for a already confirmed waybill", () => {
    expect.assertions(1);
    return confirmArrive("1", "", "1390000", new Date()).then((res) => {
      expect(res.result).toBe("fail");
    });
  });
  it("should return error for a server error", () => {
    expect.assertions(1);
    return confirmArrive("999", "", "1390000", new Date()).catch((res) => {
      expect(res.result).toBe("error");
    });
  });
});

describe("Query Waybills Test", () => {
  let query;
  beforeEach(() => {
    query = {
      beginDate: new Date(new Date().valueOf() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      cdcCode: "0001",
      wbStatus: 0,
      ordNo: "1",
    };
  });
  it("should return waybills", () => {
    expect.assertions(2);
    return queryWaybills(query).then((res) => {
      //console.log("test.waybill.queryWaybills.success.res:", res);
      expect(res.result).toBe("success");
      expect(res.waybills.length).toBe(res.count);
    });
  });
  it("should return empty waybills", () => {
    query.ordNo = "000";
    expect.assertions(3);
    return queryWaybills(query).then((res) => {
      //console.log("test.waybill.queryWaybills.fail.res:", res);
      expect(res.result).toBe("fail");
      expect(res.waybills).toBeNull();
      expect(res.count).toBe(0);
    });
  });
  it("should return error", () => {
    query.ordNo = "999";
    expect.assertions(3);
    return queryWaybills(query).catch((res) => {
      //console.log("test.waybill.queryWaybills.error.res:", res);
      expect(res.result).toBe("error");
      expect(res.waybills).toBeNull();
      expect(res.count).toBe(0);
    });
  });
});
