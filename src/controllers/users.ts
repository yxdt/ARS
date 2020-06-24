import Taro from "@tarojs/taro";
import { WxUserInfo, RegUser } from "src/types/ars";
import { saveUserInfo } from "./rest";

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

async function uploadWxUserInfo(
  openId: string,
  cell: string,
  userType: string,
  area: string,
  userInfo: WxUserInfo
) {
  const regUserInfo: RegUser = {
    userName: userInfo.nickName,
    openId,
    cellphone: cell,
    password: "",
    userType: userType,
    area: area,
    avatarUrl: userInfo.avatarUrl,
    country: userInfo.country,
    province: userInfo.province,
    city: userInfo.city,
    gender: userInfo.gender === 1 ? "男" : "女",
  };
  const ret = await saveUserInfo(regUserInfo);
  return ret;
}

export { getDriverLocation, getWxOpenId, getUserInfo };
