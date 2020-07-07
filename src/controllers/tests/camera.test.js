const { approvePicture, rejectPicture } = require("../camera.ts");

describe("Approve Uploaded Picture.", () => {
  it("should approve the picture", () => {
    expect.assertions(3);
    return approvePicture("1", "123", "alsdfjasifwek").then((res) => {
      //console.log("camera.test.approvePicture.success.res:", res);
      expect(res.result).toBe("approve");
      expect(res.filename).toBe("123");
      expect(res.remark).toBe("");
    });
  });
  it("should have no permission to approve the picture", () => {
    expect.assertions(3);
    return approvePicture("1", "123", "000000").then((res) => {
      //console.log("camera.test.approvePicture.success.res:", res);
      expect(res.result).toBe("noperm");
      expect(res.filename).toBe("123");
      expect(res.remark).toBe("");
    });
  });
  it("should got an error", () => {
    expect.assertions(3);
    return approvePicture("999", "123", "alsdfjasifwek").catch((res) => {
      //console.log("camera.test.approvePicture.error.res:", res);
      expect(res.result).toBe("error");
      expect(res.filename).toBe("123");
      expect(res.remark).toBe("");
    });
  });
});

describe("Reject Uploaded Picture.", () => {
  it("should reject the picture", () => {
    expect.assertions(3);
    return rejectPicture("1", "123", "not clear", "12031023910110").then(
      (res) => {
        //console.log("cmaera.test.rejectPicture.success.res:", res);
        expect(res.result).toBe("reject");
        expect(res.filename).toBe("123");
        expect(res.remark).toBe("not clear");
      }
    );
  });
  it("should have no permission to reject the picture", () => {
    expect.assertions(3);
    return rejectPicture("1", "123", "not clear", "000000").then((res) => {
      //console.log("camera.test.rejectPicture.success.res:", res);
      expect(res.result).toBe("noperm");
      expect(res.filename).toBe("123");
      expect(res.remark).toBe("not clear");
    });
  });
  it("should got an error", () => {
    expect.assertions(3);
    return rejectPicture("999", "123", "not clear", "alsdfjasifwek").catch(
      (res) => {
        //console.log("camera.test.approvePicture.error.res:", res);
        expect(res.result).toBe("error");
        expect(res.filename).toBe("123");
        expect(res.remark).toBe("not clear");
      }
    );
  });
});
