import Taro from "@tarojs/taro";

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

function uploadReceipt() {
  console.log("not impleted yet");
}

export { scanBarcode, takePicture, uploadReceipt };
