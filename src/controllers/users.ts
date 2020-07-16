import Taro from "@tarojs/taro";
//import { WxUserInfo, RegUser } from "src/types/ars";
import { userLogin } from "./rest";
import QQMapWX from "../libs/qqmap-wx-jssdk";
import { DriverInfo, loginResult } from "../types/ars";

function getDriverInfo(phone: string): Promise<DriverInfo> {
  let driverInfo: DriverInfo = {
    phone,
    openid: "",
    latitude: "",
    longitude: "",
    address: "",
  };
  return new Promise((res) => {
    //测试号标志
    if (phone === "1390000") {
      setTimeout(() => {
        driverInfo.latitude = "123.45";
        driverInfo.longitude = "234.56";
        driverInfo.address = "北京市东城区长安街1号";
        driverInfo.openid = "123abcdefg9887";

        ////consolelog("getDriverInfo.driverInfo:", driverInfo);
        res(driverInfo);
      }, 1000);
    } else {
      getWxOpenId((openid) => {
        driverInfo.openid = openid;
        getDriverLocation((ret) => {
          driverInfo.latitude = ret.latitude;
          driverInfo.longitude = ret.longitude;
          driverInfo.address = ret.address;
          ////consolelog("getDriverInfo.driverInfo:", driverInfo);
          res(driverInfo);
        });
      });
    }
  });
}

function getDriverLocation(resolve: Function) {
  ////consolelog("wbno:", wbno);

  Taro.getLocation({
    type: "wgs84",
    success: (res) => {
      const qqmapsdk = new QQMapWX({
        key: "HV2BZ-HMTC6-IICS7-ESS5M-BFX2E-V6B5B",
      });
      const loc = { latitude: res.latitude, longitude: res.longitude };
      ////consolelog("cur position:", loc);
      qqmapsdk.reverseGeocoder({
        location: loc || "",
        success: (resLoc) => {
          ////consolelog("resLoc:", resLoc);
          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            address: resLoc.result.address,
          });
        },
        fail: () => {
          //consolelog("error when find address:", err);
          resolve({
            latitude: "",
            longitude: "",
            address: "",
          });
        },
      });
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
    },
  });
}
function getWxOpenId(cbOpenId: Function) {
  const locOpenId = Taro.getStorageSync("userOpenId");
  if (locOpenId && locOpenId.length > 0) {
    cbOpenId(locOpenId);
  } else {
    Taro.login({
      success: (res) => {
        let code = res.code;
        Taro.request({
          url: "https://api.hanyukj.cn/tims/getwxopenid/" + code,
          data: {},
          header: { "content-type": "json" },
          success: (resp) => {
            let openId = JSON.parse(resp.data).openid;
            Taro.setStorage({ key: "userOpenId", data: openId });
            ////consolelog("controllers.users.getWxOpenId.openID:", openId);
            ////consolelog("resp:", resp);
            cbOpenId(openId);
          },
        });
      },
    });
  }
}

async function getUserInfo() {
  try {
    const ui = await Taro.getUserInfo();
    ////consolelog("Taro.getUserInfo:", ui);
    return ui.userInfo;
  } catch (err) {
    ////consolelog("err in controllers/users/getUserInfo:", err);
  }
}

// async function uploadWxUserInfo(
//   openId: string,
//   cell: string,
//   userType: string,
//   area: string,
//   userInfo: WxUserInfo
// ) {
//   const regUserInfo: RegUser = {
//     userName: userInfo.nickName,
//     openId,
//     cellphone: cell,
//     password: "",
//     userType: userType,
//     area: area,
//     avatarUrl: userInfo.avatarUrl,
//     country: userInfo.country,
//     province: userInfo.province,
//     city: userInfo.city,
//     gender: userInfo.gender === 1 ? "男" : "女",
//   };
//   const ret = await saveUserInfo(regUserInfo);
//   return ret;
// }

async function doLogin(cellphone, password): Promise<loginResult> {
  ////consolelog('controllers.user.doLogin:', cellphone, password);
  let success = false;
  let ret: loginResult = {
    result: "success",
    user: { userName: "", roleName: "" },
  };
  let restRet;
  try {
    restRet = await userLogin(cellphone, password);
  } catch (err) {
    ////consolelog("login error:", err);
    restRet = { code: "0500", data: null };
  }
  ////consolelog("controllers.users.doLogin.res:", restRet);
  if (restRet.code === "0000") {
    if (restRet.data && restRet.data.userName) {
      ret.user = restRet.data;
    } else {
      ret.result = "fail";
    }
    success = true;
  } else {
    ret.result = "error";
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      ////consolelog('controllers.users.doLogin.res.rej:', restRet);
      rej(ret);
    }
  });
}

export { getDriverLocation, getWxOpenId, getUserInfo, doLogin, getDriverInfo };
