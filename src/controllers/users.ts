import Taro from '@tarojs/taro';

function getDriverLocation(wbno: string, resolve: Function) {
  console.log('wbno:', wbno);
  Taro.getLocation({
    type: 'wgs84',
    success: (res) => {
      //成功获取司机位置信息可以做一些服务器端操作，比如存储位置信息。
      //res:
      //{
      //   accuracy: 65
      //   errMsg: "getLocation:ok"
      //   horizontalAccuracy: 65
      //   latitude: 39.92855
      //   longitude: 116.41637
      //   speed: -1
      //   verticalAccuracy: 65
      //}
      resolve(res);
    },
  });
}

export { getDriverLocation };
