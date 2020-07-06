import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Picker, Button } from "@tarojs/components";
import {
  AtAvatar,
  AtGrid,
  AtList,
  AtListItem,
  AtFloatLayout,
  AtMessage,
} from "taro-ui";

import "./index.scss";
import NavBar from "../../components/navbar";
import ArsTabBar from "../../components/tabbar";
import { WxUserInfo } from "../../types/ars";
import { SERVER_URL } from "../../controllers/rest";
import userpng from "../../assets/img/user.png";
export default function UserInfo() {
  const [curAvatar, setAvatar] = useState(
    Taro.getStorageSync("avatar") || userpng
  );
  const [nickName, setNickName] = useState(
    Taro.getStorageSync("nickName") || ""
  );
  const [cellphone] = useState(Taro.getStorageSync("cellphone") || "");
  const [userName, setUserName] = useState(
    Taro.getStorageSync("userName") || ""
  );
  const [roleName] = useState(Taro.getStorageSync("roleName") || "");
  const [openDetail, setOpenDetail] = useState(false);
  //const [init, setInit] = useState(true);
  const userAuth: boolean = Taro.getStorageSync("userAuth");
  const loggedIn = Taro.getStorageSync("roleName").toString().length > 0;

  //console.log("UserInfo:", this);

  function getUserInfo() {
    let curUserInfo = {};
    let userInfoStr = "scope.userInfo";
    const userOpenId = Taro.getStorageSync("userOpenId") || "";
    Taro.getSetting()
      .then((res) => {
        if (res.authSetting[userInfoStr]) {
          console.log("userSettings:", res);
        }
      })
      .catch((err) => {
        console.log("error in getSetting():", err.errMsg);
      });

    Taro.getUserInfo()
      .then((ret) => {
        console.log("getUserInfo.ret:", ret);
        //if (isWx) {
        Taro.setStorage({ key: "nickName", data: ret.userInfo.nickName });
        Taro.setStorage({ key: "avatar", data: ret.userInfo.avatarUrl });
        setNickName(ret.userInfo.nickName);
        setAvatar(ret.userInfo.avatarUrl);
        //}T
        setUserInfo(ret.userInfo);

        //get open id
        Taro.login({
          fail: (err) => {
            console.log("error in login:", err);
          },
          success: (res) => {
            let code = res.code;
            Taro.request({
              url: "https://api.hanyukj.cn/tims/getwxopenid/" + code,
              data: {},
              header: { "content-type": "json" },
              fail: (err) => {
                console.log("err in get openid:", err);
              },
              success: (resp) => {
                let openId = JSON.parse(resp.data).openid;
                const snKey = JSON.parse(resp.data).session_key;

                console.log("response:", resp);
                console.log("response.data:", ret.encryptedData);
                console.log("openID:", openId);
                console.log("resp:", resp);

                Taro.request({
                  url: SERVER_URL + "/users/userInfo",
                  method: "POST",
                  data: {
                    session_key: snKey,
                    iv: ret.iv,
                    data: ret.encryptedData,
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded",
                  },
                }).then((ret) => {
                  console.log("client_post_response:", ret);
                });
              },
            });
          },
        });
      })
      .catch((err) => {
        console.log("err in getUserInfo:", err);
      });
  }

  function setUserInfo(userInfo: WxUserInfo) {
    console.log("setUserInfo:", userInfo);
    setAvatar(userInfo.avatarUrl || userpng);
    setNickName(userInfo.nickName || "匿名用户");
    setUserName(userInfo.nickName || "匿名用户");
  }

  function onGotUserInfo(res) {
    //const {isWx, isBd, isTt} = this.state;
    console.log("user info got return:", res);
    const isWx = true;
    Taro.setStorage({ key: "userAuth", data: true });
    if (isWx) {
      getUserInfo();
    }
  }
  // if (init) {
  //   setInit(false);
  //   console.log(this.$router.params);

  //   if (this.$router.params) {
  //     setUserInfo(this.$router.params);
  //   }
  // }
  function onOpenDetail() {
    console.log("onOpenDetail:", openDetail);
    setOpenDetail(!openDetail);
  }
  return (
    <View className="index">
      <NavBar />
      <AtMessage />
      <View className="user-info-span">
        <View className="user-avatar">
          <AtAvatar image={curAvatar} size="normal" />
        </View>
        <View className="user-info">
          {userAuth ? (
            <View className="user-detail">
              <View className="user-detail-1">
                {userName || nickName}（{roleName || "未登录"}）
              </View>
              <View className="user-detail-2">手机：{cellphone}</View>
            </View>
          ) : (
            <Button
              openType="getUserInfo"
              onGetUserInfo={onGotUserInfo}
              className="login-button"
            >
              微信授权
            </Button>
          )}
        </View>
      </View>
      <View style={{ fontSize: "0.8rem", color: "#ff0000" }}>
        <AtGrid
          onClick={(item, index) => {
            console.log("atgrid:", item, index);
            switch (index) {
              case 0:
                //Taro.navigateTo({url: "/pages/user/Register",});
                Taro.requestSubscribeMessage({
                  tmplIds: ["JGqcKfzKMIg7FSPdM5_n0o1q8u3HH9hsr41SDSwgBls"],
                  success: (res) => {
                    console.log("subscribe message success:", res);
                  },
                });
                break;
              case 1:
                //getUserInfo();
                loggedIn
                  ? Taro.navigateTo({ url: "/pages/camera/verify" })
                  : Taro.atMessage({
                      message: "请先登录到系统",
                      type: "error",
                    });
                break;
              case 2:
                loggedIn
                  ? Taro.navigateTo({ url: "/pages/sheet/query" })
                  : Taro.atMessage({
                      message: "请先登录到系统",
                      type: "error",
                    });

                break;
              default:
                console.log("wait...");
                break;
            }
          }}
          data={[
            {
              iconInfo: {
                prefixClass: "fa",
                value: "comments",
                size: 40,
                color: "#62a60a",
              },
              value: "消息订阅",
            },
            {
              iconInfo: {
                prefixClass: "fa",
                value: "wpforms",
                size: 40,
                color: loggedIn ? "#ce007c" : "#d6d6d6",
              },
              value: "回执审核",
            },
            {
              iconInfo: {
                prefixClass: "fa",
                value: "pencil-square-o",
                size: 40,
                color: loggedIn ? "#d15805" : "#d6d6d6",
              },
              value: "运单查询",
            },
          ]}
        ></AtGrid>
      </View>
      <View className="list-span">
        <Text className="list-title">系统消息</Text>
        <AtList className="message-list">
          <AtListItem className="list-items" title="运单已交付"></AtListItem>
          <AtListItem
            className="list-items"
            title="货品已入库"
            extraText="详细信息"
            onClick={onOpenDetail}
          ></AtListItem>
          <AtListItem
            className="list-items"
            title="回执已上传成功"
            extraText="标记已读"
          ></AtListItem>
          <AtListItem className="list-items" title="运单已交付"></AtListItem>
          <AtListItem
            className="list-items"
            title="货品已入库"
            extraText="详细信息"
          ></AtListItem>
          <AtListItem
            className="list-items"
            title="回执已上传成功"
            extraText="标记已读"
          ></AtListItem>
          <AtListItem className="list-items" title="运单已交付"></AtListItem>
          <AtListItem
            className="list-items"
            title="货品已入库"
            extraText="详细信息"
          ></AtListItem>
          <AtListItem
            className="list-items"
            title="回执已上传成功"
            extraText="标记已读"
          ></AtListItem>
        </AtList>
      </View>
      <AtFloatLayout
        isOpened={openDetail}
        title="消息标题"
        onClose={onOpenDetail}
      >
        消息详细信息消息详细信息，消息详细信息消息详细信息消息详细信息，消息详细信息。
      </AtFloatLayout>
      <ArsTabBar current={2} />
    </View>
  );
}
