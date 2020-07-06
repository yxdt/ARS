import Taro from "@tarojs/taro";
import { SERVER_URL } from "./rest";
import {
  TimsResponse,
  uploadResult,
  verifyParams,
  verifyResult,
} from "src/types/ars";
import { verifyRequest } from "src/mock/api";
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
  console.log("uploadPicture:", wbno, filePath);
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

function verifyPicture(vrf: verifyParams): Promise<verifyResult> {
  let vrfResult: verifyResult;
  try {
    vrfResult = await verifyPhoto(vrf);
  } catch (e) {
    vrfResult = e;
  }
}
function approvePicture(wbno: string, imgid: string, openid: string) {
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
function rejectPicture(wbno: string, imgid: string, openid: string) {
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : "";
  const status = 1; //rejected
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
export {
  scanBarcode,
  takePicture,
  uploadPicture,
  approvePicture,
  rejectPicture,
};
