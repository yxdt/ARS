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
  photoDoneParam,
  delParams,
  delData,
  WaybillCompleteParams,
  WaybillCompleteData,
} from "../types/ars";
const DEBUGGING = false;
const devUrl = "http://192.168.0.100:8765";
const prodUrl = "https://tims.lg.com.cn";

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
  msgid: number
  //mark: number //2: read, 3:hide
): Promise<TimsResponse<string>> {
  const ret = await taroRequest<TimsResponse<string>>(
    "/message/sysMessage/read?id=" + msgid,
    //"/message/mark?msgid=" + msgid + "&mark=" + mark,
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
    "/message/sysMessage/wx",
    "GET",
    query,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  //consolelog("queryMessage:", query, ret);
  return ret;
}
//查询未审核回执--中心人员功能
async function queryUnVerified(
  openid: string
): Promise<TimsResponse<uvPhotoListData>> {
  const ret = await taroRequest<TimsResponse<uvPhotoListData>>(
    "/logistics/check",
    "GET",
    { openId: openid },
    {
      "X-Access-Token": Taro.getStorageSync("token"),
    }
  );
  return ret;
}
//删除回执照片
async function deletePhoto(
  delParam: delParams
): Promise<TimsResponse<delData>> {
  const ret = await taroRequest<TimsResponse<delData>>(
    "/driver/delete",
    "POST",
    delParam,
    {
      "content-type": "application/x-www-form-urlencoded",
    }
  );
  //consolelog("rest.deletePhoto.ret:", ret);
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
    {
      "content-type": "application/x-www-form-urlencoded",
      "X-Access-Token": Taro.getStorageSync("token"),
    }
  );
  //consolelog("rest.verifyPhoto.ret", ret);
  //if (ret.data) {
  //  return ret.data;
  //}
  return ret;
}

//运单确认通过
async function completeWaybill(wbInfo: WaybillCompleteParams) {
  const ret = await taroRequest<TimsResponse<WaybillCompleteData>>(
    "/logistics/confirmall",
    "POST",
    wbInfo,
    {
      "content-type": "application/x-www-form-urlencoded",
      "X-Access-Token": Taro.getStorageSync("token"),
    }
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
  //consolelog("rest.getWaybill.ret:", ret);
  return ret;
}
//运单查询功能
async function queryWaybill(query: queryParams) {
  //consolelog("queryWaybill:", query);
  const ret = await taroRequest<TimsResponse<queryData>>(
    "/logistics/search",
    "GET",
    query,
    {
      "X-Access-Token": Taro.getStorageSync("token"),
    }
  );
  return ret;
}
//查询运单状态进度
async function queryWbStatus(wbNum: string) {
  //consolelog("rest.queryWbStatus:", wbNum);
  const ret = await taroRequest<TimsResponse<wbStatusData>>(
    "/order/code/" + wbNum,
    "GET",
    null,
    null
  );
  return ret;
}

//标记当前运单回执已上传完成
async function photoComplete(wbInfo: photoDoneParam) {
  const ret = await taroRequest<TimsResponse<any>>(
    "/driver/complete",
    "POST",
    wbInfo,
    { "content-type": "application/x-www-form-urlencoded" }
  );
  //consolelog("rest.photoComplete.ret:", ret);
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
    //consolelog("getWbPhotos:", photos);
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
//openId登录
async function openidLogin(openid: string): Promise<TimsResponse<loginData>> {
  const ret = await taroRequest<TimsResponse<loginData>>(
    "/logistics/openIdLogin",
    "POST",
    {
      openId: openid,
    },
    { "content-type": "application/x-www-form-urlencoded" }
  );
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
  //consolelog("rest.userLogin.ret:", ret);
  //Taro.setStorage({ key: "roleName", data: roleName });
  //Taro.setStorage({ key: "userName", data: userName });

  return ret;
}
//虚拟API
async function taroRequest<T>(url: string, method, data, header) {
  let ret;
  //consolelog("url:", SERVER_URL + url);
  ret = await Taro.request<T>({
    url: SERVER_URL + url,
    method: method || "GET",
    data: data || {},
    header: header || { "content-type": "application/json" },
  });
  //consolelog("toraRequest.ret:", ret);
  if (ret && ret.statusCode === 200) {
    ret = ret.data;
  } else {
    ret = { code: "5000", message: "网络访问错误" };
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
  deletePhoto,
  photoComplete,
  queryUnVerified,
  saveUserInfo,
  userLogin,
  openidLogin,
  sendArriveMessage,
  sendUploadMessage,
  sendRejectMessage,
  queryMessage,
  markMessage,
  completeWaybill,
};
