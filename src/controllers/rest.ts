import Taro, { offLocalServiceResolveFail } from "@tarojs/taro";

const DEBUGGING = true;

const devUrl = "http://localhost:8700";
const prodUrl = "https://www.hanyukj.cn";
const SERVER_URL = DEBUGGING ? devUrl : prodUrl;

async function getWaybill(wbNum: string) {
  if (DEBUGGING) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.log("waybill.timeout:");
        res({
          id: 123456,
          sheetNum: wbNum,
          status: "loaded",
          statusCaption: "尚未送达",
          startDatetime: new Date(),
          loadNum: "load-num-123",
          driverId: 100,
          driverName: "张强",
          plateNum: "京A-12345",
          rdcCode: "01",
          rdcName: "北京国美",
          shiptoCode: "02",
          shiptoName: "呼和浩特国美",
          shiptoAddress: "内蒙古呼和浩特长征东路123号",
          shiptoTel: "0471-9879876",
          shipItems: [
            {
              id: 20,
              sheetId: 123456,
              seq: 1,
              orderNum: "KDP_ord-123",
              modelNum: "model-02039",
              qty: 1,
              status: "loaded",
            },
            {
              id: 21,
              sheetId: 123456,
              seq: 2,
              orderNum: "12-OUYD-124",
              modelNum: "AA-model-102039",
              qty: 2,
              status: "loaded",
            },
            {
              id: 22,
              sheetId: 123456,
              seq: 3,
              orderNum: "KDEA-124NBG",
              modelNum: "KSO-model-022339",
              qty: 10,
              status: "loaded",
            },
          ],
        });
      }, 10);
    });
  }
}

async function taroRequest(url, method, data) {
  if (DEBUGGING) {
    console.log("taroRequest.SERVER_URL:", SERVER_URL, url);
  }
  const ret = await Taro.request({
    url: SERVER_URL + url,
    method: method || "GET",
    data: data || {},
    header: { "content-type": "application/json" },
  });
  return ret;
}

export { SERVER_URL, getWaybill };
