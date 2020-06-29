import Taro from "@tarojs/taro";
import { RegUser, WaybillConfirmParams, TimsResponse } from "src/types/ars";

const DEBUGGING = true;
const devUrl = "http://192.168.0.100:8765";
const prodUrl = "https://tims.lg.com.cn"; //"https://www.hanyukj.cn";
const SERVER_URL = DEBUGGING ? devUrl : prodUrl;

// async function saveDriverLocation(wbNum: string, loc: string) {
//   if (DEBUGGING) {
//     return new Promise((res, rej) => {
//       setTimeout(() => {
//         console.log("user.saveDriverLocation.timeout");
//         res({
//           shtteNum: wbNum,
//           location: loc,
//           result: "success",
//         });
//       }, 1000);
//     });
//   } else {
//     console.log("!!1not implemented yet!!!");
//   }
// }

async function confirmWaybill(wbInfo: WaybillConfirmParams) {
  const url = SERVER_URL + "/driver/confirm";

  if (DEBUGGING) {
    console.log("confirmWaybill.params:", wbInfo);
    return new Promise((res) => {
      setTimeout(() => {
        console.log("waybill.confirmWaybill.timeout");
        res({
          messageId: "0000aksdkfasdfas",
          data: {},
          code: "0000",
          message: "Successful operation",
          sentTime: new Date(),
          responseTime: new Date(),
        });
      }, 1000);
    });
  } else {
    const ret = await Taro.request({
      url,
      method: "POST",
      data: wbInfo,
      header: { "content-type": "application/x-www-form-urlencoded" },
    });
    console.log("confirmWaybill.ret:", ret);
    console.log("!!1not implemented yet!!!");
  }
}

async function getWaybill(wbNum: string) {
  if (DEBUGGING) {
    return new Promise((res) => {
      setTimeout(() => {
        console.log("waybill.getWaybill.timeout:");
        const status =
          wbNum === "1" ? "arrived" : wbNum === "2" ? "confirmed" : "loaded";
        const statusCaption =
          wbNum === "1"
            ? "已确认送达"
            : wbNum === "2"
            ? "中心已确认"
            : "尚未送达";
        if (wbNum === "000") {
          res({ result: "not found" });
          //清除本地运单号
          Taro.removeStorage({ key: "waybill" });
          Taro.removeStorage({ key: "wbstatus" });
        } else {
          //存储本地运单号
          Taro.setStorage({ key: "waybill", data: wbNum });
          Taro.setStorage({ key: "wbstatus", data: status });
          Taro.setStorage({ key: "waybilldate", data: new Date().valueOf() });
          res({
            result: "success",
            waybill: {
              id: 123456,
              sheetNum: wbNum,
              status,
              statusCaption,
              arriveTime: new Date(new Date().valueOf() - 22 * 60 * 60 * 1000),
              loadNum: "load-num-123",
              driverId: 100,
              driverName: "张强",
              plateNum: "京A-123456",
              rdcCode: "0101",
              rdcName: "北京国美",
              shiptoCode: "02",
              shiptoName: "呼和浩特国美",
              shiptoAddress: "内蒙古呼和浩特长征东路123号",
              shiptoTel: "0471-9879876",
              totalPages: 2,
              shipItems: [
                {
                  id: 20,
                  sheetId: 123456,
                  seq: 1,
                  page: 1,
                  orderNum: "KDP_ord-123",
                  modelNum: "model-02039",
                  qty: 1,
                  status: "loaded",
                },
                {
                  id: 21,
                  sheetId: 123456,
                  seq: 2,
                  page: 1,
                  orderNum: "12-OUYD-124",
                  modelNum: "AA-model-102039",
                  qty: 2,
                  status: "loaded",
                },
                {
                  id: 22,
                  sheetId: 123456,
                  seq: 3,
                  page: 1,
                  orderNum: "KDEA-124NBG",
                  modelNum: "KSO-model-022339",
                  qty: 10,
                  status: "loaded",
                },
                {
                  id: 23,
                  sheetId: 123456,
                  seq: 4,
                  page: 1,
                  orderNum: "zxcvKDP_ord-123",
                  modelNum: "adsf-model-02039",
                  qty: 1,
                  status: "loaded",
                },
                {
                  id: 24,
                  sheetId: 123456,
                  seq: 5,
                  page: 1,
                  orderNum: "asahfgh-12-OUYD-124",
                  modelNum: "ncvb-AA-model-102039",
                  qty: 2,
                  status: "loaded",
                },
                {
                  id: 25,
                  sheetId: 123456,
                  seq: 6,
                  page: 2,
                  orderNum: "vzxcvKDEA-12asd4NBG",
                  modelNum: "asdfasKSO-moasdel-022339",
                  qty: 10,
                  status: "loaded",
                },
                {
                  id: 26,
                  sheetId: 123456,
                  seq: 7,
                  page: 2,
                  orderNum: "asaasdfhfgh-12-OUYD-124",
                  modelNum: "ncvb-AA-model-102039",
                  qty: 2,
                  status: "loaded",
                },
                {
                  id: 27,
                  sheetId: 123456,
                  seq: 8,
                  page: 2,
                  orderNum: "884-vzxcvKDEA-12asd4NBG",
                  modelNum: "asdfasKSO-moasdel-022339",
                  qty: 10,
                  status: "loaded",
                },
              ],
            },
          });
        }
      }, 10);
    });
  } else {
    console.log("!!1not implemented yet!!!");
  }
}

async function getWbPhotos(wbNum: string) {
  if (DEBUGGING) {
    const photos = await taroRequest("/photos/bywb/" + wbNum, "GET", {});
    console.log("getWbPhotos:", photos);
    return photos.data;
  }
}

async function saveUserInfo(userInfo: RegUser) {
  const url = "/users/save";
  const ret = await Taro.request({
    url: SERVER_URL + url,
    method: "POST",
    data: userInfo,
    header: { "content-type": "application/x-www-form-urlencoded" },
  });
  return ret;
}

async function userLogin(cellphone: string, password: string) {
  const url = SERVER_URL + "/logistics/login";
  //let userName = "";
  //let roleName = "";
  let retVal = { result: false, userName: "", roleName: "" };
  console.log("controllers.rest.userLogin:", cellphone, password);
  if (DEBUGGING) {
    return new Promise((res) => {
      setTimeout(() => {
        console.log("debugging");
        if (cellphone === "1390000" && password !== "") {
          retVal.userName = "何燕员";
          retVal.roleName = "中心核验员";
          retVal.result = true;
        } else {
          retVal.userName = "";
          retVal.roleName = "";
          retVal.result = false;
        }
        //Taro.setStorage({ key: "roleName", data: roleName });
        //Taro.setStorage({ key: "userName", data: userName });
        res(retVal);
      }, 1000);
    });
  } else {
    const ret = await Taro.request<TimsResponse>({
      url,
      method: "POST",
      data: {
        pwd: password,
        phone: cellphone,
      },
      header: { "content-type": "application/x-www-form-urlencoded" },
    });

    if (ret.data.code === "0000") {
      retVal.userName = ret.data.data["userName"];
      retVal.roleName = ret.data.data["roleName"];
      retVal.result = true;
    }
    //Taro.setStorage({ key: "roleName", data: roleName });
    //Taro.setStorage({ key: "userName", data: userName });
  }

  return retVal;
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

export {
  SERVER_URL,
  getWaybill,
  confirmWaybill,
  getWbPhotos,
  saveUserInfo,
  userLogin,
};
