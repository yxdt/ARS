import Taro from "@tarojs/taro";
import { SERVER_URL, verifyPhoto, queryUnVerified } from "./rest";
import {
  TimsResponse,
  uploadResult,
  verifyParams,
  verifyResult,
  verifyData,
  uvPhotoResult,
  uvPhotoListData,
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
  console.log("uploadPicture:", wbno, filePath);
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
    console.log("file_upload:url:", SERVER_URL + "/driver/photo");
    Taro.uploadFile({
      url: SERVER_URL + "/driver/photo", //"/photos/upload",
      filePath,
      name: "photo",
      formData: {
        openId: openid,
        carAllocNo: ordNo,
        shpToSeq: shpToCd,
      },
      timeout: 15000, //for testing purpose
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          ret.upload = JSON.parse(res.data);
          ret.result = "success";
        }
        response(ret);
      },
      fail: () => {
        //ret = { filePath: "", fileName: "" };
        ret.result = "fail";
        response(ret);
      },
    }).catch((err) => {
      //ret = { filePath: "", fileName: "" };
      console.log("upload photo fail:", err);
      ret.result = "error";
      reject(ret);
    });
  });
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
  if (uvResult.code === "0000") {
    if (uvResult.data) {
      ret.photos = uvResult.data.photos;
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
    filename: vrf.imgId, //.imgid,
  };
  ////consolelog("camera.verifyPicture.vrf:", vrf);
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
  ////consolelog("camera.verifyPicture.verifyPhoto.result:", vrfResult);
  if (vrfResult.code === "0000" && vrfResult.data) {
    ret.result = vrfResult.data.result || "";
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

//回执审核通过
function approvePicture(
  wbno: string,
  imgid: string,
  openid: string
): Promise<verifyResult> {
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  const status = 0; //approved
  const remark = "";
  const vrf: verifyParams = {
    carAllocNo: ordNo,
    shpToSeq: shpToCd,
    status,
    remark,
    imgId: imgid,
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
  const status = 1; //rejected

  const vrf: verifyParams = {
    carAllocNo: ordNo,
    shpToSeq: shpToCd,
    status,
    remark,
    imgId: imgid,
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
};
