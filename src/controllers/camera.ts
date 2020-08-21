import Taro from "@tarojs/taro";
import {
  SERVER_URL,
  verifyPhoto,
  queryUnVerified,
  photoComplete,
  deletePhoto,
} from "./rest";
import {
  TimsResponse,
  uploadResult,
  verifyParams,
  verifyResult,
  verifyData,
  photoDoneParam,
  delParams,
  delResult,
  delData,
  queryResult,
  wbqData,
} from "../types/ars";
import { getStatusCaption } from "./waybill";

//扫描运单二维码，返回二维码内含字符串
function scanBarcode(cbBarcode) {
  Taro.scanCode({
    success: cbBarcode,
  });
}

//拍照功能
function takePicture(resolve) {
  const ctx = Taro.createCameraContext();
  ctx.takePhoto({
    quality: "high",
    success: resolve,
  });
}

//照片上传功能
function uploadPicture(
  wbno: string,
  filePath: string,
  openid: string
): Promise<uploadResult> {
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  let ret: uploadResult = {
    result: "",
    upload: {
      fileName: "",
      filePath: "",
      id: "",
    },
    message: "成功",
  };
  return new Promise((response, reject) => {
    Taro.uploadFile({
      url: SERVER_URL + "/driver/photo",
      filePath,
      name: "multipartFile",
      formData: {
        openId: openid,
        carAllocNo: ordNo,
        shpToSeq: shpToCd,
      },
      timeout: 15000, //for testing purpose
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const upResult = JSON.parse(res.data);
          if (upResult.code === "0000" && upResult.data) {
            ret.upload = upResult.data;
            ret.result = "success";
          } else {
            ret.result = "fail";
            ret.upload = upResult;
            ret.message = upResult.message;
          }
        }
        response(ret);
      },
      fail: (errr) => {
        ret.result = "fail";
        ret.message = "上传失败";
        response(ret);
      },
    }).catch((err) => {
      ret.result = "error";
      ret.message = "网络错误";
      reject(ret);
    });
  });
}
//确定回执已完成上传
async function confirmPhotoComplete(
  wbno: string,
  openid: string
): Promise<any> {
  const comParam: photoDoneParam = {
    openId: openid,
    carAllocNo: wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno,
    shpToSeq: wbno.length > 4 ? wbno.substr(wbno.length - 4) : "",
  };

  const ret = await photoComplete(comParam);
  return ret;
}
//查询尚未审核的已上传回执列表
async function queryUnVerifiedPhotos(openid: string): Promise<queryResult> {
  let uvResult;
  let success = true;
  const ret: queryResult = {
    result: "success",
    count: 0,
    waybills: [],
  };
  try {
    uvResult = await queryUnVerified(openid);
  } catch (e) {
    uvResult = {
      code: "0500",
      data: null,
      message: "error",
      messageId: "202022",
      sentTime: new Date(),
      responseTime: new Date(),
    };
    success = false;
  }
  if (uvResult.code === "0000") {
    if (uvResult.data && uvResult.data.orderList) {
      ret.waybills = uvResult.data.orderList.map((item: wbqData) => ({
        wbNum: item.carAllocNo + item.shpToSeq,
        rdcCode: item.dcCd,
        rdcName: item.dcFullNm,
        totalPages: 1,
        shiptoCode: item.shpToSeq,
        shiptoName: item.shpToNm,
        arriveTime: item.insertDate,
        status: item.status + "",
        statusCaption: getStatusCaption(item.status),
        shipItems: [],
        photos: null,
        pgYmd: item.pgYmd,
        dcFullNm: item.dcFullNm,
        dcIdt: item.dcIdt,
      }));
      ret.count = uvResult.data.orderList.length;
    } else {
      ret.result = "fail";
      ret.count = 0;
      ret.waybills = null;
    }
    success = true;
  } else {
    ret.result = "error";
    ret.count = 0;
    ret.waybills = null;
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

async function deletePicture(
  wbno: string,
  imgId: string,
  openId: string
): Promise<delResult> {
  let delData: TimsResponse<delData>;
  let success = true;
  const param: delParams = {
    carAllocNo: wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno,
    shpToSeq: wbno.length > 4 ? wbno.substr(wbno.length - 4) : "",
    id: imgId,
    openId,
  };
  const ret: delResult = {
    result: "success",
    remark: "deleted",
  };
  try {
    delData = await deletePhoto(param);
  } catch (e) {
    delData = {
      code: "0500",
      data: null,
      message: "数据访问错误",
      messageId: "0000000000",
      sentTime: new Date(),
      responseTime: new Date(),
    };
    success = false;
  }
  if (delData.code === "0000" && delData.data) {
    ret.result = "success";
  } else {
    ret.result = "error";
    success = false;
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

//回执核验功能
async function verifyPicture(vrf: verifyParams): Promise<verifyResult> {
  let vrfResult: TimsResponse<verifyData>;
  let success = true;
  const ret: verifyResult = {
    result: "approve",
    remark: vrf.remark,
    imgIds: vrf.imgIds,
    filename: "",
    closed: 1,
  };

  try {
    vrfResult = await verifyPhoto(vrf);
  } catch (e) {
    vrfResult = {
      code: "0500",
      data: null,
      message: "数据访问错误",
      messageId: "0000000000",
      sentTime: new Date(),
      responseTime: new Date(),
    };
    success = false;
  }
  if (vrfResult.code === "0000" && vrfResult.data) {
    ret.result = "success";
    ret.closed = vrfResult.data.closed;
  } else {
    ret.result = "error";
    ret.closed = 1;
    success = false;
  }

  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

//回执审核通过
function approvePicture(
  wbno: string,
  imgid: string,
  openid: string
): Promise<verifyResult> {
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  const status = 1; //approved
  const remark = "通过";
  const vrf: verifyParams = {
    carAllocNo: ordNo,
    shpToSeq: shpToCd,
    status,
    remark,
    imgIds: imgid,
    openId: openid,
  };
  return verifyPicture(vrf);
}

//回执驳回
function rejectPicture(
  wbno: string,
  imgid: string,
  remark: string,
  openid: string
): Promise<verifyResult> {
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  const status = 0; //rejected

  const vrf: verifyParams = {
    carAllocNo: ordNo,
    shpToSeq: shpToCd,
    status,
    remark,
    imgIds: imgid,
    openId: openid,
  };
  return verifyPicture(vrf);
}

export {
  scanBarcode,
  takePicture,
  uploadPicture,
  approvePicture,
  deletePicture,
  rejectPicture,
  queryUnVerifiedPhotos,
  confirmPhotoComplete,
};
