import Taro from "@tarojs/taro";
import { SERVER_URL } from "./rest";
function scanBarcode() {
  Taro.scanCode({
    success: (res) => {
      //resolve(res);
      console.log("scan barcode success:", res);
      if (res.result) {
        Taro.navigateTo({
          url: "/pages/index/index?wbno=" + res.result,
        });
      }
    },
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
  cbResult: any,
  cbFail: any
) {
  console.log("uploadPicture:", wbno, filePath);
  Taro.uploadFile({
    url: SERVER_URL + "/photos/upload",
    filePath,
    name: "photo",
    formData: {
      wbno: wbno,
    },
    timeout: 5000, //for testing purpose
    success: cbResult,
    fail: cbFail,
  }).catch(cbFail);
}

export { scanBarcode, takePicture, uploadPicture };
