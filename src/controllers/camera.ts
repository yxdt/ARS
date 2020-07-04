import Taro from "@tarojs/taro";
import { SERVER_URL } from "./rest";
import { TimsResponse, uploadResult } from "src/types/ars";
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

export { scanBarcode, takePicture, uploadPicture };
