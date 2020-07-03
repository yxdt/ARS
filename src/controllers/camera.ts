import Taro from '@tarojs/taro';
import { SERVER_URL } from './rest';
function scanBarcode(cbBarcode) {
  Taro.scanCode({
    success: cbBarcode,
  });
}

function takePicture(resolve) {
  const ctx = Taro.createCameraContext();
  ctx.takePhoto({
    quality: 'high',
    success: resolve,
  });
}

function uploadPicture(wbno: string, filePath: string, cbResult: any, cbFail: any) {
  console.log('uploadPicture:', wbno, filePath);
  const ordNo = wbno.length > 4 ? wbno.substr(0, wbno.length - 4) : wbno;
  const shpToCd = wbno.length > 4 ? wbno.substr(wbno.length - 4) : '';
  Taro.uploadFile({
    url: SERVER_URL + '/photos/upload',
    filePath,
    name: 'photo',
    formData: {
      ordNo,
      shpToCd,
    },
    timeout: 5000, //for testing purpose
    success: cbResult,
    fail: cbFail,
  }).catch(cbFail);
}

export { scanBarcode, takePicture, uploadPicture };
