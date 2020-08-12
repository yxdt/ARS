import Taro from "@tarojs/taro";
import { SERVER_URL, verifyPhoto, queryUnVerified, photoComplete } from "./rest";
import {
  TimsResponse,
  uploadResult,
  verifyParams,
  verifyResult,
  verifyData,
  uvPhotoResult,
  uvPhotoListData,
  photoDoneParam,
} from "../types/ars";

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
  //consolelog("uploadPicture.wbno, filePath:", wbno, filePath);
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  let ret: uploadResult = {
    result: "",
    upload: {
      fileName: "",
      filePath: "",
      id: "",
    },
  };
  return new Promise((response, reject) => {
    //consolelog("file_upload:url:", SERVER_URL + "/driver/photo");
    Taro.uploadFile({
      url: SERVER_URL + "/driver/photo", //"/photos/upload",
      filePath,
      name: "multipartFile",
      formData: {
        openId: openid,
        carAllocNo: ordNo,
        shpToSeq: shpToCd,
      },
      timeout: 15000, //for testing purpose
      success: (res) => {
        //result: "success"
        //upload:
        //code: "0000"
        //data: {fileName: "tmp_3de83ae4651de55995413adbdf0c6f68_1597062731841.jpg", filePath: "/BJZI20010100033788/tmp_3de83ae4651de55995413adbdf0c6f68_1597062731841.jpg", id: "e679f7d4feaeccfd4f54f61ec998c65e"}
        //message: "操作成功！"
        //messageId: "4b14c0e373d824190173d85b584f0012"
        //responseTime: "2020-08-10 20:32:11.855"
        //sentTime: "2020-08-10 20:32:11.836"
        //consolelog("success.res:", res);
        if (res.statusCode === 200 && res.data) {
          const upResult = JSON.parse(res.data);
          if (upResult.code === "0000" && upResult.data) {
            ret.upload = upResult.data;
            ret.result = "success";
          } else {
            ret.result = "fail";
            ret.upload = upResult;
          }
        }
        response(ret);
      },
      fail: (errr) => {
        //consolelog("upload fail:", errr);
        //ret = { filePath: "", fileName: "" };
        ret.result = "fail";
        response(ret);
      },
    }).catch((err) => {
      //ret = { filePath: "", fileName: "" };
      //consolelog("upload photo fail:", err);
      ret.result = "error";
      reject(ret);
    });
  });
}
//确定回执已完成上传
async function confirmPhotoComplete(
  wbno: string,  
  openid: string
): Promise<any> {
  //consolelog("uploadPicture.wbno, filePath:", wbno, filePath);
  const comParam: photoDoneParam = {
    openId:openid,
    carAllocNo: wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno,
    shpToSeq : wbno.length > 4 ? wbno.substr(wbno.length - 4) : "",
  }
  try{
    const ret = await photoComplete(comParam);
    //consolelog(ret);
  }
}
//查询尚未审核的已上传回执列表
async function queryUnVerifiedPhotos(openid: string): Promise<uvPhotoResult> {
  let uvResult: TimsResponse<uvPhotoListData>;
  let success = true;
  const ret: uvPhotoResult = {
    result: "success",
    photos: null,
  };
  try {
    uvResult = await queryUnVerified(openid);
  } catch (e) {
    uvResult = e;
    success = false;
  }
  //consolelog("queryUnVerified:", uvResult);
  if (uvResult.code === "0000") {
    if (uvResult.data) {
      ret.photos = uvResult.data.orderImageList;
    }
  } else {
    ret.result = "error";
    ret.photos = null;
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
    imgIds: vrf.imgId, //.imgid,
  };
  //consolelog("camera.verifyPicture.vrf:", vrf);
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
  //consolelog("camera.verifyPicture.verifyPhoto.result:", vrfResult);
  if (vrfResult.code === "0000" && vrfResult.data) {
    ret.result = "success"//vrfResult.data.result || "";
  } else {
    ret.result = "error";
    success = false;
  }
  //consolelog('verifyPicture:', ret);
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
  rejectPicture,
  queryUnVerifiedPhotos,
  confirmPhotoComplete
};
