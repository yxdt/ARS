import Taro from "@tarojs/taro";
import {
  RegUser,
  WaybillConfirmParams,
  TimsResponse,
  wbData,
  photoListData,
  loginData,
  WaybillConfirmData,
  msgSentData,
  verifyData,
  verifyParams,
  queryParams,
  queryData,
  msgQueryParams,
  msgQueryData,
  wbStatusData,
  uvPhotoListData,
} from "../types/ars";
import {
  loginRequest,
  waybillRequest,
  photosRequest,
  wbcRequest,
  arriveMsgRequest,
  uploadMsgRequest,
  rejectMsgRequest,
  verifyRequest,
  queryRequest,
  queryMsgRequest,
  markMsgRequest,
  wbStatusRequest,
  unVerifiedRequest,
} from "../mock/api";

const DEBUGGING = false;
const devUrl = "http://192.168.0.100:8765";
const prodUrl = "https://tims.lg.com.cn"; //"https://www.hanyukj.cn";
const SERVER_URL = DEBUGGING ? devUrl : prodUrl;

//发送司机确认到达提示消息
async function sendArriveMessage(
  wbno: string, //shipCode + rdcCode
  openid: string
) {
  const ret = await taroRequest<TimsResponse<msgSentData>>(
    "/message/arrive?wbno=" + wbno + "&openid=" + openid,
    "GET",
    null,
    null
  );
  return ret;
}
//发送回执已上传消息
async function sendUploadMessage(wbno: string, openid: string) {
  const ret = await taroRequest<TimsResponse<msgSentData>>(
    "/message/upload?wbno=" + wbno + "&openid=" + openid,
    "GET",
    null,
    null
  );
  return ret;
}
//发送回执已驳回消息
async function sendRejectMessage(wbno: string, openid: string) {
  const ret = await taroRequest<TimsResponse<msgSentData>>(
    "/message/reject?wbno=" + wbno + "&openid=" + openid,
    "GET",
    null,
    null
  );
  return ret;
}
//标记消息已读
async function markMessage(
  msgid: number,
  mark: number //2: read, 3:hide
): Promise<TimsResponse<string>> {
  const ret = await taroRequest<TimsResponse<string>>(
    "/message/mark?msgid=" + msgid + "&mark=" + mark,
    "GET",
    null,
    null
  );
  return ret;
}
//消息列表查询
async function queryMessage(
  query: msgQueryParams
): Promise<TimsResponse<msgQueryData>> {
  const ret = await taroRequest<TimsResponse<msgQueryData>>(
    "/message/query",
    "POST",
    query,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  return ret;
}
//查询未审核回执--中心人员功能
async function queryUnVerified(
  openid: string
): Promise<TimsResponse<uvPhotoListData>> {
  const ret = await taroRequest<TimsResponse<uvPhotoListData>>(
    "/photos/unverify/" + openid,
    "GET",
    null,
    null
  );
  return ret;
}
//审核回执
async function verifyPhoto(
  verifydata: verifyParams
): Promise<TimsResponse<verifyData>> {
  const ret = await taroRequest<TimsResponse<verifyData>>(
    "/logistics/confirm",
    "POST",
    verifydata,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  return ret;
}
//确认运单到达
async function confirmWaybill(wbInfo: WaybillConfirmParams) {
  const ret = await taroRequest<TimsResponse<WaybillConfirmData>>(
    "/driver/confirm",
    "POST",
    wbInfo,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  return ret;
}
//获取运单详情
async function getWaybill(wbNum: string) {
  const ret = await taroRequest<TimsResponse<wbData>>(
    "/order/code/" + wbNum,
    "GET",
    null,
    null
  );
  console.log("rest.getWaybill.ret:", ret);
  return ret;
}
//运单查询功能
async function queryWaybill(query: queryParams) {
  const ret = await taroRequest<TimsResponse<queryData>>(
    "/order/search",
    "GET",
    query,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  return ret;
}
//查询运单状态进度
async function queryWbStatus(wbNum: string) {
  console.log("rest.queryWbStatus:", wbNum);
  const ret = await taroRequest<TimsResponse<wbStatusData>>(
    "/order/code/" + wbNum,
    "GET",
    null,
    null
  );
  return ret;
}
//async function uploadPhoto() {}
//获取运单已上传回执列表
async function getWbPhotos(wbNum: string) {
  if (DEBUGGING) {
    const photos = await taroRequest<TimsResponse<photoListData>>(
      "/photos/bywb/" + wbNum,
      "GET",
      {},
      null
    );
    ////consolelog("getWbPhotos:", photos);
    return photos;
  }
}
//保存用户信息
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
//用户登录
async function userLogin(
  cellphone: string,
  password: string
): Promise<TimsResponse<loginData>> {
  const ret = await taroRequest<TimsResponse<loginData>>(
    "/logistics/phoneLogin",
    "POST",
    {
      pwd: password,
      phone: cellphone,
      openId: Taro.getStorageSync("userOpenId"),
    },
    { "content-type": "application/x-www-form-urlencoded" }
  );
  ////consolelog('rest.userLogin.ret:', ret);
  //Taro.setStorage({ key: "roleName", data: roleName });
  //Taro.setStorage({ key: "userName", data: userName });

  return ret;
}
//虚拟API
async function taroRequest<T>(url: string, method, data, header) {
  let ret;
  console.log("taroRequest:", url, method, data, header);
  if (DEBUGGING) {
    ////consolelog('DEBUGGING.taroRequest.SERVER_URL:', url);
    if (url === "/logistics/login") {
      ret = await loginRequest(data);
    } else if (url.startsWith("/order/code/")) {
      ret = await waybillRequest(url);
    } else if (url.startsWith("/photos/bywb/")) {
      ret = await photosRequest(url);
    } else if (url === "/driver/confirm") {
      ret = await wbcRequest(data);
    } else if (url.startsWith("/message/arrive")) {
      ret = await arriveMsgRequest(url);
    } else if (url.startsWith("/message/upload")) {
      ret = await uploadMsgRequest(url);
    } else if (url.startsWith("/message/reject")) {
      ret = await rejectMsgRequest(url);
    } else if (url === "/logistics/confirm") {
      ret = await verifyRequest(data);
    } else if (url === "/order/search") {
      ret = await queryRequest(data);
    } else if (url === "/message/query") {
      ret = await queryMsgRequest(data);
    } else if (url.startsWith("/message/mark")) {
      ret = await markMsgRequest(url);
    } else if (url.startsWith("/order/status")) {
      ret = await wbStatusRequest(url);
    } else if (url.startsWith("/photos/unverify")) {
      ret = await unVerifiedRequest(url);
    }
  } else {
    console.log("url:", SERVER_URL + url);
    ret = await Taro.request<T>({
      url: SERVER_URL + url,
      method: method || "GET",
      data: data || {},
      header: header || { "content-type": "application/json" },
    });
    console.log("toraRequest.ret:", ret);
    if (ret && ret.statusCode === 200) {
      ret = ret.data;
    } else {
      ret = { code: "5000", message: "网络访问错误" };
    }
  }
  return ret;
}

export {
  SERVER_URL,
  DEBUGGING,
  getWaybill,
  confirmWaybill,
  queryWaybill,
  queryWbStatus,
  getWbPhotos,
  verifyPhoto,
  queryUnVerified,
  saveUserInfo,
  userLogin,
  sendArriveMessage,
  sendUploadMessage,
  sendRejectMessage,
  queryMessage,
  markMessage,
};
