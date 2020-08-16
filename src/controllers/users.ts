import Taro from "@tarojs/taro";
//import { WxUserInfo, RegUser } from "src/types/ars";
import { userLogin, openidLogin, SERVER_URL } from "./rest";
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

function checkToken() {
  const loggedIn = Taro.getStorageSync("roleName").toString().length > 0;
  let ret = 0; //0:没有登陆过，1：登录且token有效，2.登录但token过期
  if (loggedIn) {
    const logindate = new Date(Taro.getStorageSync("tokendate"));
    const today = new Date();
    if (today.valueOf() - logindate.valueOf() > 12 * 60 * 60 * 1000) {
      console.info("user token expired...");
      Taro.removeStorageSync("userName");
      Taro.removeStorageSync("roleName");
      Taro.removeStorageSync("token");
      ret = 2;
    } else {
      ret = 1;
    }
  }
  return ret;
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
          url: SERVER_URL + "/wx/openid",
          data: { code },
          header: { "content-type": "application/x-www-form-urlencoded" },
          method: "POST",
          success: (resp) => {
            if (resp.data && resp.data.code === "0000" && resp.data.data) {
              let openId = resp.data.data.openObj.openid;
              Taro.setStorage({ key: "userOpenId", data: openId });
              //consolelog("controllers.users.getWxOpenId.openID:", openId);
              cbOpenId(openId);
            }
          },
          fail: (res) => {
            console.warn("login-fail:", res);
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

async function doOpenidLogin(openId): Promise<loginResult> {
  let success = false;
  let ret: loginResult = {
    result: "success",
    user: { userName: "", roleName: "", token: "" },
    message: "成功",
  };
  let restRet;
  try {
    restRet = await openidLogin(openId);
  } catch (err) {
    //consolelog("login error:", err);
    restRet = { code: "0500", data: null };
  }
  //consolelog("controllers.users.doOpenidLogin.res:", restRet);
  if (restRet.code === "0000") {
    if (restRet.data && restRet.data.data && restRet.data.data.username) {
      const roleName =
        restRet.data.departs && restRet.data.departs.length > 0
          ? restRet.data.departs[0].departName
          : restRet.data.data.realname;
      ret.user = {
        userName: restRet.data.data.username,
        roleName,
        token: restRet.data.token,
      };
    } else {
      ret.result = "fail";
      ret.message = restRet.message;
    }
    success = true;
  } else {
    ret.result = "error";
    ret.message = restRet.message;
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

async function doLogin(cellphone, password): Promise<loginResult> {
  //consolelog("controllers.user.doLogin:", cellphone, password);
  //consolelog("userOpenId:", Taro.getStorageSync("userOpenId"));
  const locOpenId = Taro.getStorageSync("userOpenId");

  let success = false;
  let ret: loginResult = {
    result: "success",
    user: { userName: "", roleName: "", token: "" },
    message: "成功",
  };
  let restRet;
  try {
    restRet = await userLogin(cellphone, password);
  } catch (err) {
    //consolelog("login error:", err);
    restRet = { code: "0500", data: null };
  }
  //consolelog("controllers.users.doLogin.res:", restRet);
  if (restRet.code === "0000") {
    if (restRet.data && restRet.data.data && restRet.data.data.username) {
      const roleName =
        restRet.data.departs && restRet.data.departs.length > 0
          ? restRet.data.departs[0].departName
          : restRet.data.data.realname;
      ret.user = {
        userName: restRet.data.data.username,
        roleName,
        token: restRet.data.token,
      };
    } else {
      ret.result = "fail";
      ret.message = "登录失败";
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

export {
  checkToken,
  getDriverLocation,
  getWxOpenId,
  getUserInfo,
  doLogin,
  doOpenidLogin,
  getDriverInfo,
};
