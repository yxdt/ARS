const { loadWaybill } = require("../waybill.ts");

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
      console.log("test.loadWaybill3342.res:", res);
      expect(res.result).toBe("success");
      expect(res.waybill.wbNum).toBe("3342");
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
