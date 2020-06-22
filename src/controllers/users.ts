import Taro from "@tarojs/taro";

function getDriverLocation(wbno: string, resolve: Function) {
  console.log("wbno:", wbno);
  Taro.getLocation({
    type: "wgs84",
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
function getWxOpenId(cbOpenId: Function) {
  Taro.login({
    success: (res) => {
      let code = res.code;
      Taro.request({
        url: "https://api.hanyukj.cn/tims/getwxopenid/" + code,
        data: {},
        header: { "content-type": "json" },
        success: (resp) => {
          let openId = JSON.parse(resp.data).openid;
          console.log("openID:", openId);
          console.log("resp:", resp);
          cbOpenId(openId);
        },
      });
    },
  });
}

async function getUserInfo() {
  const ui = await Taro.getUserInfo();
  console.log("Taro.getUserInfo:", ui);
  return ui.userInfo;
}

export { getDriverLocation, getWxOpenId, getUserInfo };
