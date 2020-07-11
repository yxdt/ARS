import Taro from "@tarojs/taro";
import { SERVER_URL, verifyPhoto, queryUnVerified } from "./rest";
import {
  TimsResponse,
  uploadResult,
  verifyParams,
  verifyResult,
  verifyData,
  PhotosResult,
  photoListData,
  uvPhotoResult,
  uvPhotoListData,
} from "../types/ars";

function scanBarcode(cbBarcode) {
  Taro.scanCode({
    success: cbBarcode,
  });
}

function takePicture(resolve) {
  const ctx = Taro.createCameraContext();
  ctx.takePhoto({
    quality: "high",
    success: resolve,
  });
}

function uploadPicture(
  wbno: string,
  filePath: string,
  openid: string
): Promise<uploadResult> {
  //console.log("uploadPicture:", wbno, filePath);
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  let ret: uploadResult = {
    result: "",
    upload: {
      fileName: "",
      filePath: "",
    },
  };
  return new Promise((response, reject) => {
    Taro.uploadFile({
      url: SERVER_URL + "/photos/upload",
      filePath,
      name: "photo",
      formData: {
        openid,
        ordNo,
        shpToCd,
      },
      timeout: 5000, //for testing purpose
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
    }).catch(() => {
      //ret = { filePath: "", fileName: "" };
      ret.result = "error";
      reject(ret);
    });
  });
}

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

async function verifyPicture(vrf: verifyParams): Promise<verifyResult> {
  let vrfResult: TimsResponse<verifyData>;
  let success = true;
  const ret: verifyResult = {
    result: "approve",
    remark: vrf.remark,
    filename: vrf.imgid,
  };
  //console.log("camera.verifyPicture.vrf:", vrf);
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
  //console.log("camera.verifyPicture.verifyPhoto.result:", vrfResult);
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
    ordNo,
    shpToCd,
    status,
    remark,
    imgid,
    openid,
  };
  return verifyPicture(vrf);
}
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
    ordNo,
    shpToCd,
    status,
    remark,
    imgid,
    openid,
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
