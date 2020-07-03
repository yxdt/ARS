import Taro from "@tarojs/taro";
import {
  RegUser,
  WaybillConfirmParams,
  TimsResponse,
  wbData,
  photoListData,
  loginData,
  WaybillConfirmData,
} from "../types/ars";
import {
  loginRequest,
  waybillRequest,
  photosRequest,
  wbcRequest,
} from "../mock/api";

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
  const ret = await taroRequest<TimsResponse<WaybillConfirmData>>(
    "/driver/confirm",
    "POST",
    wbInfo,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  return ret;
}

async function getWaybill(wbNum: string) {
  const ret = await taroRequest<TimsResponse<wbData>>(
    "/order/code/" + wbNum,
    "GET",
    null,
    null
  );
  return ret;
}

async function getWbPhotos(wbNum: string) {
  if (DEBUGGING) {
    const photos = await taroRequest<TimsResponse<photoListData>>(
      "/photos/bywb/" + wbNum,
      "GET",
      {},
      null
    );
    //console.log("getWbPhotos:", photos);
    return photos;
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

async function userLogin(
  cellphone: string,
  password: string
): Promise<TimsResponse<loginData>> {
  const ret = await taroRequest<TimsResponse<loginData>>(
    "/logistics/login",
    "POST",
    {
      pwd: password,
      phone: cellphone,
    },
    { "content-type": "application/x-www-form-urlencoded" }
  );
  //console.log('rest.userLogin.ret:', ret);
  //Taro.setStorage({ key: "roleName", data: roleName });
  //Taro.setStorage({ key: "userName", data: userName });

  return ret;
}

async function taroRequest<T>(url: string, method, data, header) {
  let ret;
  if (DEBUGGING) {
    //console.log('DEBUGGING.taroRequest.SERVER_URL:', url);
    if (url === "/logistics/login") {
      ret = await loginRequest(data);
    } else if (url.startsWith("/order/code/")) {
      ret = await waybillRequest(url);
    } else if (url.startsWith("/photos/bywb/")) {
      ret = await photosRequest(url);
    } else if (url === "/driver/confirm") {
      ret = await wbcRequest(data);
    }
  } else {
    ret = await Taro.request<T>({
      url: SERVER_URL + url,
      method: method || "GET",
      data: data || {},
      header: header || { "content-type": "application/json" },
    });
  }
  return ret;
}

export {
  SERVER_URL,
  DEBUGGING,
  getWaybill,
  confirmWaybill,
  getWbPhotos,
  saveUserInfo,
  userLogin,
};
